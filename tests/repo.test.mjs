import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const cases = [
  ['scalar', { stargazerCount: 42 }, 42],
  ['scalar-zero', { stargazerCount: 0 }, 0],
  ['legacy', { stargazers: { totalCount: 23 } }, 23],
  ['legacy-zero', { stargazers: { totalCount: 0 } }, 0],
  ['scalar-precedence', { stargazerCount: 42, stargazers: { totalCount: 23 } }, 42],
  ['scalar-zero-precedence', { stargazerCount: 0, stargazers: { totalCount: 23 } }, 0],
];

test('repo shortcode renders scalar and legacy star counts', async (t) => {
  const site = mkdtempSync(join(tmpdir(), 'iris-repo-test-'));
  t.after(() => rmSync(site, { recursive: true, force: true }));
  for (const dir of ['content', 'data/github', 'layouts/_default', 'layouts/shortcodes']) {
    mkdirSync(join(site, dir), { recursive: true });
  }
  writeFileSync(join(site, 'hugo.toml'),
    'baseURL = "https://example.org/"\ndisableKinds = ["home", "taxonomy", "term", "RSS", "sitemap"]\n');
  writeFileSync(join(site, 'layouts/_default/single.html'), '{{ .Content }}');
  copyFileSync(new URL('layouts/shortcodes/repo.html', root), join(site, 'layouts/shortcodes/repo.html'));
  const nodes = cases.map(([name, stars]) => ({
    name,
    nameWithOwner: `fixture/${name}`,
    url: `https://github.com/fixture/${name}`,
    description: 'Fixture repository',
    primaryLanguage: { name: 'HTML' },
    forkCount: 7,
    ...stars,
  }));
  writeFileSync(join(site, 'data/github/fixture.json'), JSON.stringify({
    data: { user: { repositories: { nodes } } },
  }));
  for (const [name] of cases) {
    writeFileSync(join(site, `content/${name}.md`),
      `---\ntitle: ${name}\n---\n{{< repo id="fixture" name="${name}" >}}\n`);
  }
  execFileSync('hugo', ['--source', site], { encoding: 'utf8' });
  for (const [name, , count] of cases) {
    await t.test(name, () => {
      const html = readFileSync(join(site, `public/${name}/index.html`), 'utf8');
      assert.match(html, new RegExp(`⭐&nbsp;${count}</div>`));
      assert.ok(html.includes(`fixture/${name}`));
      assert.ok(html.includes('7 Forks'));
    });
  }
});

test('example fetch query requests the scalar without the stargazers connection', () => {
  const script = readFileSync(new URL('exampleSite/scripts/fetch_data.sh', root), 'utf8');
  assert.match(script, /\bstargazerCount\b/);
  assert.doesNotMatch(script, /\bstargazers\s*\{/);
});
