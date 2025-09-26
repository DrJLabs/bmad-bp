const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const {
  formatTimestamp,
  buildEvidenceDirectory,
  buildEvidencePaths,
} = require('../capture-release-evidence.js');

const EVIDENCE_ROOT = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'docs',
  'bmad',
  'focused-epics',
  'release-governance',
  'evidence',
);

test('formatTimestamp returns ISO-8601 compact string', () => {
  const fixed = new Date('2025-09-26T18:42:31.123Z');
  const value = formatTimestamp(fixed);
  assert.equal(value, '20250926T184231Z');
});

test('buildEvidenceDirectory composes path with run id and timestamp', () => {
  const dir = buildEvidenceDirectory('18021773065', '20250926T184231Z');
  assert.equal(dir, path.join(EVIDENCE_ROOT, 'release-run-18021773065-20250926T184231Z'));
});

test('buildEvidencePaths returns expected filenames', () => {
  const paths = buildEvidencePaths('42', '20250926T184231Z');
  assert.equal(paths.baseDir, path.join(EVIDENCE_ROOT, 'release-run-42-20250926T184231Z'));
  assert.equal(paths.authStatus, path.join(paths.baseDir, 'gh-auth-status-20250926T184231Z.txt'));
  assert.equal(paths.metadata, path.join(paths.baseDir, 'release-run-42-metadata.json'));
  assert.equal(paths.log, path.join(paths.baseDir, 'release-run-42.log'));
  assert.equal(paths.artifactsDir, path.join(paths.baseDir, 'artifacts'));
  assert.equal(
    paths.dryRun,
    path.join(paths.baseDir, 'semantic-release-dry-run-20250926T184231Z.log'),
  );
});
