'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const REPOSITORY = 'peaceiris/hugo-theme-iris';
const DEPENDABOT_ID = 49699333;
const MAX_ZIP_BYTES = 64 * 1024 * 1024;

// All identity data comes from GitHub, never from files inside the artifact.
async function validateSource({ github, context }) {
  assert.equal(`${context.repo.owner}/${context.repo.repo}`, REPOSITORY);
  const source = context.payload.workflow_run;
  assert.ok(Number.isSafeInteger(source?.id) && source.id > 0);
  const { data: run } = await github.rest.actions.getWorkflowRun({
    ...context.repo, run_id: source.id,
  });
  assert.equal(run.id, source.id);
  assert.equal(run.event, 'pull_request');
  assert.equal(run.status, 'completed');
  assert.equal(run.conclusion, 'success');
  assert.equal(run.path, '.github/workflows/ci.yml');
  assert.equal(run.repository.full_name, REPOSITORY);
  assert.equal(run.head_repository.full_name, REPOSITORY);
  assert.equal(run.actor.id, DEPENDABOT_ID);
  assert.equal(run.actor.login, 'dependabot[bot]');
  assert.equal(run.head_sha, source.head_sha);
  assert.equal(run.run_attempt, source.run_attempt);
  assert.match(run.head_sha, /^[0-9a-f]{40}$/);
  assert.equal(run.pull_requests.length, 1);
  const number = run.pull_requests[0].number;
  assert.ok(Number.isSafeInteger(number) && number > 0);
  const { data: pr } = await github.rest.pulls.get({
    ...context.repo, pull_number: number,
  });
  assert.equal(pr.state, 'open');
  assert.equal(pr.merged, false);
  assert.equal(pr.user.id, DEPENDABOT_ID);
  assert.equal(pr.user.login, 'dependabot[bot]');
  assert.equal(pr.head.repo.full_name, REPOSITORY);
  assert.equal(pr.base.repo.full_name, REPOSITORY);
  assert.equal(pr.base.ref, 'main');
  assert.equal(pr.head.sha, run.head_sha);
  assert.equal(pr.head.ref, run.head_branch);
  assert.equal(run.pull_requests[0].head.sha, run.head_sha);
  return { run, pr };
}

async function selectArtifact({ github, context }) {
  const { run } = await validateSource({ github, context });
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, {
    ...context.repo, run_id: run.id, per_page: 100,
  });
  const name = `netlify-preview-${run.head_sha}`;
  const matches = artifacts.filter(a => a.name === name);
  assert.equal(matches.length, 1, 'Expected exactly one static preview artifact');
  const artifact = matches[0];
  assert.ok(Number.isSafeInteger(artifact.id) && artifact.id > 0);
  assert.equal(artifact.expired, false);
  assert.equal(artifact.workflow_run.id, run.id);
  assert.equal(artifact.workflow_run.head_sha, run.head_sha);
  assert.ok(Number.isSafeInteger(artifact.size_in_bytes) &&
    artifact.size_in_bytes > 0 && artifact.size_in_bytes <= MAX_ZIP_BYTES);
  assert.match(artifact.digest, /^sha256:[0-9a-f]{64}$/);
  // Reject stale artifacts retained from an earlier attempt of the same run.
  assert.ok(Date.parse(artifact.created_at) >= Date.parse(run.run_started_at));
  return { id: artifact.id, runId: run.id, archiveName: `${name}.zip` };
}

async function validateArchive({ downloadPath, expectedDirectory, archiveName }) {
  assert.equal(downloadPath, expectedDirectory, 'Unexpected artifact download path');
  assert.match(archiveName, /^netlify-preview-[0-9a-f]{40}\.zip$/);
  assert.ok((await fs.lstat(downloadPath)).isDirectory(), 'Expected a real download directory');
  // With skip-decompress, the action saves the raw file using the blob's filename.
  assert.deepEqual(await fs.readdir(downloadPath), [archiveName], 'Expected exactly one named ZIP');
  const archivePath = path.join(downloadPath, archiveName);
  const archive = await fs.lstat(archivePath);
  assert.ok(archive.isFile() && archive.size > 0 && archive.size <= MAX_ZIP_BYTES,
    'Expected a regular ZIP file within the size limit');
  return archivePath;
}

function validatePreviewUrl(value) {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:');
  // The action returns the immutable draft deployment URL, not the production URL.
  assert.match(url.hostname, /^[0-9a-f]{24}--hugo-theme-iris\.netlify\.app$/);
  assert.equal(url.port, '');
  assert.equal(url.username, '');
  assert.equal(url.password, '');
  assert.equal(url.pathname, '/');
  assert.equal(url.search, '');
  assert.equal(url.hash, '');
  return url.href;
}

async function record({ github, context, url, fetchImpl = fetch }) {
  const previewUrl = validatePreviewUrl(url);
  // Do not follow redirects to production or to an attacker-chosen origin.
  const response = await fetchImpl(previewUrl, {
    redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  await response.body?.cancel();
  assert.equal(response.status, 200, 'Preview must return HTTP 200');
  assert.match(response.headers.get('content-type') || '', /^text\/html(?:;|$)/i);
  const { run, pr } = await validateSource({ github, context });
  const { data: deployment } = await github.rest.repos.createDeployment({
    ...context.repo,
    ref: pr.head.sha,
    environment: 'pull request',
    description: `Dependabot preview from CI run ${run.id}`,
    auto_merge: false,
    required_contexts: [],
    transient_environment: true,
    production_environment: false,
  });
  assert.ok(Number.isSafeInteger(deployment.id));
  assert.equal(deployment.sha, pr.head.sha);
  // Recheck after deployment creation: never mark an outdated head successful.
  await validateSource({ github, context });
  await github.rest.repos.createDeploymentStatus({
    ...context.repo,
    deployment_id: deployment.id,
    state: 'success',
    environment: 'pull request',
    environment_url: previewUrl,
    log_url: run.html_url,
    auto_inactive: false,
  });
}

module.exports = { validateSource, selectArtifact, validateArchive, validatePreviewUrl, record };
