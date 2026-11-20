'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  validateSource, selectArtifact, validateArchive, validatePreviewUrl, record,
} = require('../scripts/netlify-preview.cjs');
const fs = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');

function fixture() {
  const sha = 'a'.repeat(40);
  // Workflow-run repository objects do not include default_branch.
  const repo = { full_name: 'peaceiris/hugo-theme-iris' };
  const bot = { id: 49699333, login: 'dependabot[bot]' };
  const run = {
    id: 123, run_attempt: 1, event: 'pull_request', status: 'completed',
    conclusion: 'success', path: '.github/workflows/ci.yml', actor: { ...bot },
    repository: { ...repo }, head_repository: { ...repo }, head_sha: sha,
    head_branch: 'dependabot/npm/foo', pull_requests: [{ number: 42, head: { sha } }],
    run_started_at: '2026-11-19T00:00:00Z', html_url: 'https://github.com/peaceiris/hugo-theme-iris/actions/runs/123',
  };
  const pr = {
    number: 42, state: 'open', merged: false, user: { ...bot },
    head: { sha, ref: run.head_branch, repo: { ...repo } }, base: { ref: 'main', repo: { ...repo } },
  };
  const context = { repo: { owner: 'peaceiris', repo: 'hugo-theme-iris' },
    payload: { workflow_run: { id: 123, head_sha: sha, run_attempt: 1 } } };
  const writes = [];
  const github = { rest: {
    actions: { getWorkflowRun: async () => ({ data: run }) },
    pulls: { get: async () => ({ data: pr }) },
    repos: {
      createDeployment: async args => { writes.push(args); return { data: { id: 99, sha } }; },
      createDeploymentStatus: async args => { writes.push(args); },
    },
  } };
  return { github, context, run, pr, writes };
}

test('accepts successful same-repository Dependabot run for the exact open head', async () => {
  const f = fixture();
  assert.equal((await validateSource(f)).pr.number, 42);
});

for (const [name, mutate] of [
  ['failed build', f => { f.run.conclusion = 'failure'; }],
  ['push event', f => { f.run.event = 'push'; }],
  ['wrong workflow', f => { f.run.path = '.github/workflows/other.yml'; }],
  ['wrong actor', f => { f.run.actor.id = 1; }],
  ['wrong PR author', f => { f.pr.user.id = 1; }],
  ['fork run', f => { f.run.head_repository.full_name = 'attacker/fork'; }],
  ['fork PR', f => { f.pr.head.repo.full_name = 'attacker/fork'; }],
  ['closed PR', f => { f.pr.state = 'closed'; }],
  ['changed head', f => { f.pr.head.sha = 'b'.repeat(40); }],
  ['other base', f => { f.pr.base.ref = 'release'; }],
  ['missing PR association', f => { f.run.pull_requests = []; }],
  ['new attempt', f => { f.run.run_attempt = 2; }],
]) {
  test(`rejects ${name}`, async () => {
    const f = fixture(); mutate(f);
    await assert.rejects(validateSource(f));
    assert.equal(f.writes.length, 0);
  });
}

const goodUrl = 'https://0123456789abcdef01234567--hugo-theme-iris.netlify.app/';
test('only immutable HTTPS Netlify draft URLs are accepted', () => {
  assert.equal(validatePreviewUrl(goodUrl), goodUrl);
  for (const url of ['https://hugo-theme-iris.netlify.app/', 'http://0123456789abcdef01234567--site.netlify.app/',
    goodUrl + '?foo=bar', goodUrl.replace('netlify.app', 'netlify.app.evil.example')]) {
    assert.throws(() => validatePreviewUrl(url));
  }
});

test('records a successful preview on exact PR head and required environment', async () => {
  const f = fixture();
  await record({ ...f, url: goodUrl, fetchImpl: async (url, options) => {
    assert.equal(url, goodUrl); assert.equal(options.redirect, 'error');
    return new Response('<html></html>', { headers: { 'content-type': 'text/html' } });
  } });
  assert.equal(f.writes[0].ref, f.pr.head.sha);
  assert.equal(f.writes[0].environment, 'pull request');
  assert.equal(f.writes[0].production_environment, false);
  assert.equal(f.writes[1].state, 'success');
});

test('failed preview cannot create a deployment success', async () => {
  const f = fixture();
  await assert.rejects(record({ ...f, url: goodUrl, fetchImpl: async () => new Response('', { status: 404 }) }));
  assert.equal(f.writes.length, 0);
});

test('head change during preview check cannot create a deployment', async () => {
  const f = fixture();
  await assert.rejects(record({ ...f, url: goodUrl, fetchImpl: async () => {
    f.pr.head.sha = 'b'.repeat(40);
    return new Response('', { headers: { 'content-type': 'text/html' } });
  } }));
  assert.equal(f.writes.length, 0);
});

function artifactFixture() {
  const f = fixture();
  const artifact = { id: 7, name: `netlify-preview-${f.run.head_sha}`, expired: false,
    size_in_bytes: 1024, digest: `sha256:${'b'.repeat(64)}`,
    workflow_run: { id: f.run.id, head_sha: f.run.head_sha }, created_at: '2026-11-19T00:01:00Z' };
  const artifacts = [artifact];
  const list = () => {};
  f.github.rest.actions.listWorkflowRunArtifacts = list;
  f.github.paginate = async (endpoint, args) => {
    assert.equal(endpoint, list);
    assert.deepEqual(args, { owner: 'peaceiris', repo: 'hugo-theme-iris', run_id: 123, per_page: 100 });
    return artifacts;
  };
  return { f, artifact, artifacts };
}

test('selects the exact artifact ID, run ID and ZIP name for the current preview', async () => {
  const { f, artifact, artifacts } = artifactFixture();
  artifacts.push({ ...artifact, id: 8, name: 'another-artifact' });
  assert.deepEqual(await selectArtifact(f), {
    id: 7, runId: 123, archiveName: `${artifact.name}.zip`,
  });
});

for (const [name, mutate] of [
  ['duplicate name', ({ artifact, artifacts }) => artifacts.push({ ...artifact, id: 8 })],
  ['invalid ID', ({ artifact }) => { artifact.id = '7'; }],
  ['expired artifact', ({ artifact }) => { artifact.expired = true; }],
  ['wrong run', ({ artifact }) => { artifact.workflow_run.id = 124; }],
  ['wrong head', ({ artifact }) => { artifact.workflow_run.head_sha = 'b'.repeat(40); }],
  ['oversized artifact', ({ artifact }) => { artifact.size_in_bytes = 64 * 1024 * 1024 + 1; }],
  ['missing digest', ({ artifact }) => { delete artifact.digest; }],
  ['prior attempt', ({ artifact }) => { artifact.created_at = '2026-11-18T00:00:00Z'; }],
]) {
  test(`artifact selection rejects ${name}`, async () => {
    const testData = artifactFixture();
    mutate(testData);
    await assert.rejects(selectArtifact(testData.f), { name: 'AssertionError' });
  });
}

test('requires exactly the expected regular ZIP in the action output directory', async t => {
  const directory = await fs.mkdtemp(path.join(tmpdir(), 'netlify-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const archiveName = `netlify-preview-${'a'.repeat(40)}.zip`;
  const archivePath = path.join(directory, archiveName);
  const download = { downloadPath: directory, expectedDirectory: directory, archiveName };

  await assert.rejects(validateArchive({ ...download, downloadPath: tmpdir() }), /Unexpected artifact download path/);
  await assert.rejects(validateArchive(download), /Expected exactly one named ZIP/);
  await fs.writeFile(archivePath, 'fixture archive bytes');
  assert.equal(await validateArchive(download), archivePath);

  const extra = path.join(directory, 'extra.zip');
  await fs.writeFile(extra, '');
  await assert.rejects(validateArchive(download), /Expected exactly one named ZIP/);
  await fs.unlink(extra);

  await fs.truncate(archivePath, 0);
  await assert.rejects(validateArchive(download), /regular ZIP file within the size limit/);
  await fs.truncate(archivePath, 64 * 1024 * 1024 + 1);
  await assert.rejects(validateArchive(download), /regular ZIP file within the size limit/);
  await fs.unlink(archivePath);
  await fs.symlink('missing.zip', archivePath);
  await assert.rejects(validateArchive(download), /regular ZIP file within the size limit/);
});
