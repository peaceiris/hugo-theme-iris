import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);

for (const hasRepo of [true, false]) {
  test(`keyboard shortcuts with repository configured: ${hasRepo}`, async (t) => {
    const site = mkdtempSync(join(tmpdir(), 'iris-shortcut-test-'));
    t.after(() => rmSync(site, { recursive: true, force: true }));
    for (const dir of ['content/posts', 'layouts/_default', 'layouts/partials', 'assets/hotkeys-js/dist']) {
      mkdirSync(join(site, dir), { recursive: true });
    }
    writeFileSync(join(site, 'hugo.toml'), `baseURL = "https://example.org/"
defaultContentLanguage = "en"
disableKinds = ["taxonomy", "term", "RSS", "sitemap"]
${hasRepo ? '[params.repo]\nURL = "https://github.com/fixture/repo/"\nbranch = "main"\ncontentDir = "content"' : ''}
`);
    for (const layout of ['single', 'list']) {
      writeFileSync(join(site, `layouts/_default/${layout}.html`), '{{ partial "keyboard-shortcut.html" . }}');
    }
    copyFileSync(new URL('layouts/partials/keyboard-shortcut.html', root), join(site, 'layouts/partials/keyboard-shortcut.html'));
    writeFileSync(join(site, 'assets/hotkeys-js/dist/hotkeys.min.js'), '// Fixture asset\n');
    writeFileSync(join(site, 'content/posts/example.md'), '---\ntitle: Example\n---\n');
    execFileSync('hugo', ['--source', site], { encoding: 'utf8' });

    for (const [page, hasFile] of [['index.html', false], ['posts/index.html', false], ['posts/example/index.html', true]]) {
      await t.test(page, () => {
        const html = readFileSync(join(site, 'public', page), 'utf8');
        const available = hasRepo && hasFile;
        const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
        let registered;
        let handler;
        const opened = [];
        let toggles = 0;
        let reloads = 0;
        const window = {
          location: { href: '', reload: () => reloads++ },
          open: (...args) => opened.push(args),
        };
        runInNewContext(script, {
          document: { getElementById: () => ({ classList: { toggle: () => toggles++ } }) },
          window,
          hotkeys: (keys, callback) => { registered = keys.split(',').map((key) => key.trim()); handler = callback; },
        });
        assert.deepEqual(registered, available
          ? ['shift+/', 'g+h', 'g+p', 'g+e', 'g+s', 'r']
          : ['shift+/', 'g+h', 'g+p', 'r']);
        for (const key of ['g+e', 'g+s']) {
          assert.equal(html.includes(`>${key}</th>`), available);
          assert.equal(script.includes(`case '${key}':`), available);
          handler({}, { key });
        }
        assert.deepEqual(opened, available ? [
          ['https://github.com/fixture/repo/edit/main/content/en/posts/example.md', '_blank'],
          ['https://github.com/fixture/repo/blob/main/content/en/posts/example.md', '_blank'],
        ] : []);
        handler({}, { key: 'shift+/' });
        assert.equal(toggles, 1);
        handler({}, { key: 'g+h' });
        assert.equal(window.location.href, 'https://example.org/');
        handler({}, { key: 'g+p' });
        assert.equal(window.location.href, 'https://example.org/posts');
        handler({}, { key: 'r' });
        assert.equal(reloads, 1);
      });
    }
  });
}
