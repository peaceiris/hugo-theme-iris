import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const installer = new URL('../exampleSite/scripts/setup-dart-sass.sh', import.meta.url);
const version = readFileSync(installer, 'utf8').match(/^version=(.+)$/m)[1];

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'iris-sass-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const bin = join(root, 'bin');
  const install = join(root, 'install with spaces');
  mkdirSync(bin);
  mkdirSync(install);
  const executable = (path, body) => {
    writeFileSync(path, `#!/bin/sh\n${body}\n`);
    chmodSync(path, 0o755);
  };
  executable(join(bin, 'uname'), 'case "$1" in -s) echo Linux;; -m) echo x86_64;; esac');
  const run = () => spawnSync('bash', [installer.pathname], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, SASS_INSTALL_DIR: install },
  });
  return { bin, install, executable, run };
}

test('reuses the pinned native compiler without downloading', (t) => {
  const f = fixture(t);
  f.executable(join(f.install, 'sass'), `echo ${version}`);
  f.executable(join(f.bin, 'curl'), 'exit 99');
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /already installed/);
});

test('rejects a corrupt download and preserves the previous installation', (t) => {
  const f = fixture(t);
  f.executable(join(f.install, 'sass'), 'echo 0.0.0');
  f.executable(join(f.bin, 'curl'), 'while [ "$1" != "--output" ]; do shift; done\nprintf corrupt > "$2"');
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /checksum mismatch/);
  assert.match(readFileSync(join(f.install, 'sass'), 'utf8'), /0\.0\.0/);
});

test('fails clearly on unsupported platforms', (t) => {
  const f = fixture(t);
  f.executable(join(f.bin, 'uname'), 'echo unsupported');
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsupported platform/);
});

test('download failures stop installation', (t) => {
  const f = fixture(t);
  f.executable(join(f.bin, 'curl'), 'exit 22');
  assert.equal(f.run().status, 22);
});

test('CI and local development use the same Dart Sass version', () => {
  const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  const versions = [...workflow.matchAll(/dart-sass-version: "([^"\n]+)"/g)].map((match) => match[1]);
  assert.deepEqual(versions, [version, version]);
});
