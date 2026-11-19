'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { validateSource, validatePreviewUrl, record, download } = require('../scripts/netlify-preview.cjs');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');

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

test('artifact download is scoped to run, current attempt and digest', async t => {
  const f = fixture();
  const zip = Buffer.from('fixture archive bytes');
  const artifact = { id: 7, name: `netlify-preview-${f.run.head_sha}`, expired: false,
    size_in_bytes: zip.length, digest: `sha256:${createHash('sha256').update(zip).digest('hex')}`,
    workflow_run: { id: f.run.id, head_sha: f.run.head_sha }, created_at: '2026-11-19T00:01:00Z' };
  f.github.rest.actions.listWorkflowRunArtifacts = () => {};
  f.github.paginate = async (_, args) => { assert.equal(args.run_id, 123); return [artifact]; };
  f.github.rest.actions.downloadArtifact = async args => {
    assert.equal(args.artifact_id, 7); return { data: zip };
  };
  const dir = await mkdtemp(path.join(tmpdir(), 'netlify-test-'));
  const previous = process.env.RUNNER_TEMP;
  process.env.RUNNER_TEMP = dir;
  t.after(async () => {
    if (previous === undefined) delete process.env.RUNNER_TEMP; else process.env.RUNNER_TEMP = previous;
    await rm(dir, { recursive: true, force: true });
  });
  await download(f);
  assert.deepEqual(await readFile(path.join(dir, 'netlify-preview.zip')), zip);
  artifact.digest = `sha256:${'0'.repeat(64)}`;
  await assert.rejects(download(f));
  artifact.created_at = '2026-11-18T00:00:00Z';
  await assert.rejects(download(f));
  artifact.expired = true;
  await assert.rejects(download(f));
});
