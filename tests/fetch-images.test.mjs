import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fetchImages } from '../exampleSite/scripts/fetch_images.mjs';

const prefix = 'https://user-images.githubusercontent.com/123/';
const filename = (url) => `${createHash('sha256').update(url).digest('hex')}.${url.split('.').pop()}`;

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'iris-images-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const contentDir = join(root, 'content');
  const imageDir = join(root, 'assets/images');
  await mkdir(join(contentDir, 'en/posts'), { recursive: true });
  const logs = [];
  const errors = [];
  return { root, contentDir, imageDir, logs, errors,
    logger: { log: (value) => logs.push(value), error: (value) => errors.push(value) } };
}

test('downloads nested Markdown images as binary files and reuses the cache', async (t) => {
  const f = await fixture(t);
  const urls = ['one.png', 'two.jpg', 'three.jpeg'].map((name) => prefix + name);
  const bytes = Buffer.from([0, 255, 137, 80, 78, 71]);
  const requests = [];
  const server = createServer((req, res) => {
    requests.push(req.url);
    if (req.url === '/one.png') {
      res.writeHead(302, { location: '/redirected.png' });
      res.end();
    } else {
      res.end(bytes);
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const options = { ...f, fetchImpl: (url) => fetch(`http://127.0.0.1:${server.address().port}/${url.split('/').pop()}`) };
  await writeFile(join(f.contentDir, 'en/posts/images.md'), [
    `---\neyecatch: "${urls[0]}"\n---`,
    `![jpg](${urls[1]})`, `<img src="${urls[2]}">`,
    `![duplicate](${urls[0]})`,
    '![ignored](https://example.com/image.png)',
    `![ignored](${prefix}image.gif)`,
  ].join('\n'));
  await writeFile(join(f.contentDir, 'ignored.txt'), `${prefix}ignored.png`);
  await fetchImages(options);
  assert.deepEqual((await readdir(f.imageDir)).sort(), urls.map(filename).sort());
  for (const url of urls) assert.deepEqual(await readFile(join(f.imageDir, filename(url))), bytes);
  assert.deepEqual(requests, ['/one.png', '/redirected.png', '/two.jpg', '/three.jpeg']);
  assert.equal(f.errors.length, 0);
  await fetchImages({ ...f, fetchImpl: () => { throw new Error('cache should avoid network'); } });
  assert.equal(f.errors.length, 0);
  assert.equal(f.logs.filter((line) => line.startsWith('info: skip')).length, 5);
});

test('logs HTTP, network, and body failures without caching them or stopping later images', async (t) => {
  const f = await fixture(t);
  const names = ['missing.png', 'offline.jpg', 'broken.jpeg', 'ok.png'];
  await writeFile(join(f.contentDir, 'images.md'), names.map((name) => prefix + name).join('\n'));
  await fetchImages({ ...f, fetchImpl: async (url) => {
    if (url.endsWith('missing.png')) return new Response('not found', { status: 404 });
    if (url.endsWith('offline.jpg')) throw new Error('network unavailable');
    if (url.endsWith('broken.jpeg')) return { ok: true, arrayBuffer: async () => { throw new Error('truncated body'); } };
    return new Response('complete image');
  } });
  assert.equal(f.errors.length, 3);
  assert.deepEqual(await readdir(f.imageDir), [filename(prefix + 'ok.png')]);
  assert.equal(await readFile(join(f.imageDir, filename(prefix + 'ok.png')), 'utf8'), 'complete image');
});

test('CLI uses the example-site working directory and preserves existing files', async (t) => {
  const f = await fixture(t);
  const url = prefix + 'cached.png';
  await mkdir(f.imageDir, { recursive: true });
  await writeFile(join(f.imageDir, filename(url)), 'existing image');
  await writeFile(join(f.contentDir, 'cached.md'), url);
  const script = new URL('../exampleSite/scripts/fetch_images.mjs', import.meta.url);
  const result = spawnSync(process.execPath, [script.pathname], { cwd: f.root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /info: skip/);
  assert.equal(await readFile(join(f.imageDir, filename(url)), 'utf8'), 'existing image');
});

test('content without supported images does not request or create files', async (t) => {
  const f = await fixture(t);
  await writeFile(join(f.contentDir, 'plain.md'), '# No remote images');
  await fetchImages({ ...f, fetchImpl: () => assert.fail('unexpected network request') });
  assert.deepEqual(f.errors, []);
  await assert.rejects(readdir(f.imageDir), { code: 'ENOENT' });
});
