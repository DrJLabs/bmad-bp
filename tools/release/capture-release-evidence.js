/**
 * Automates capture of release evidence logs and artifacts for Story 1.4.
 *
 * Responsibilities:
 * - Verify GitHub CLI is installed and authenticated.
 * - Determine a release workflow run ID (either supplied or latest).
 * - Download workflow metadata, logs, and artifacts into the evidence directory with timestamped names.
 * - Run `semantic-release --dry-run` locally and archive the output alongside the workflow evidence.
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const EVIDENCE_ROOT = path.resolve(
  __dirname,
  '..',
  '..',
  'docs',
  'bmad',
  'focused-epics',
  'release-governance',
  'evidence',
);
const WORKFLOW_DEFAULT = 'release.yaml';

function formatTimestamp(date = new Date()) {
  return date
    .toISOString()
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replace(/\.\d{3}Z$/, 'Z');
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    const message = stderr || stdout || `${command} ${args.join(' ')} failed`;
    const err = new Error(message);
    err.code = result.status;
    err.stderr = stderr;
    err.stdout = stdout;
    throw err;
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function ensureGhAvailable() {
  runCommand('gh', ['--version']);
}

function checkGhAuth() {
  const { stdout } = runCommand('gh', ['auth', 'status']);
  return stdout;
}

function buildEvidenceDirectory(runId, timestamp) {
  if (!runId) {
    throw new Error('runId is required to build evidence directory');
  }
  if (!timestamp) {
    throw new Error('timestamp is required to build evidence directory');
  }
  return path.join(EVIDENCE_ROOT, `release-run-${runId}-${timestamp}`);
}

function buildEvidencePaths(runId, timestamp) {
  const baseDir = buildEvidenceDirectory(runId, timestamp);
  return {
    baseDir,
    authStatus: path.join(baseDir, `gh-auth-status-${timestamp}.txt`),
    metadata: path.join(baseDir, `release-run-${runId}-metadata.json`),
    log: path.join(baseDir, `release-run-${runId}.log`),
    artifactsDir: path.join(baseDir, 'artifacts'),
    dryRun: path.join(baseDir, `semantic-release-dry-run-${timestamp}.log`),
  };
}

function resolveRunId(workflow, branch, providedId) {
  if (providedId) {
    return providedId;
  }

  const args = [
    'run',
    'list',
    '--workflow',
    workflow,
    '--limit',
    '1',
    '--json',
    'databaseId,headBranch,status,event',
  ];
  if (branch) {
    args.push('--branch', branch);
  }
  const { stdout } = runCommand('gh', args);
  let runs;
  try {
    runs = JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Unable to parse gh run list output: ${error.message}`);
  }
  if (!Array.isArray(runs) || runs.length === 0) {
    throw new Error(
      `No runs found for workflow "${workflow}"${branch ? ` on branch ${branch}` : ''}.`,
    );
  }
  return String(runs[0].databaseId);
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

function downloadRunArtifacts(runId, outputDir) {
  try {
    runCommand('gh', ['run', 'download', runId, '--dir', outputDir]);
    return true;
  } catch (error) {
    const message = `${error.stderr || error.stdout || error.message}`;
    if (/no artifacts? found/i.test(message)) {
      console.warn(`[warn] No artifacts found for run ${runId}.`);
      return false;
    }
    throw error;
  }
}

function captureRunLogs(runId, destPath) {
  const { stdout } = runCommand('gh', ['run', 'view', runId, '--log']);
  writeFile(destPath, stdout);
}

function captureRunMetadata(runId, destPath) {
  const { stdout } = runCommand('gh', [
    'run',
    'view',
    runId,
    '--json',
    'conclusion,databaseId,headBranch,headSha,workflowName,event,createdAt,updatedAt,url,htmlUrl,status',
  ]);
  writeFile(destPath, `${stdout.trim()}`);
}

function runSemanticReleaseDryRun(destPath) {
  const result = spawnSync('npx', ['semantic-release', '--dry-run', '--ci', 'false'], {
    stdio: 'pipe',
    encoding: 'utf8',
    env: { ...process.env, CI: 'false' },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stdout = (result.stdout || '').trim();
    const stderr = (result.stderr || '').trim();
    const message = stderr || stdout || 'semantic-release dry run failed';
    const err = new Error(message);
    err.code = result.status;
    throw err;
  }

  writeFile(destPath, result.stdout);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    runId: undefined,
    workflow: WORKFLOW_DEFAULT,
    branch: undefined,
    skipDryRun: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--run-id':
      case '-r': {
        parsed.runId = args[i + 1];
        i += 1;
        break;
      }
      case '--workflow':
      case '-w': {
        parsed.workflow = args[i + 1];
        i += 1;
        break;
      }
      case '--branch':
      case '-b': {
        parsed.branch = args[i + 1];
        i += 1;
        break;
      }
      case '--skip-dry-run': {
        parsed.skipDryRun = true;
        break;
      }
      case '--help':
      case '-h': {
        printHelp();
        process.exit(0);
        break;
      }
      default: {
        console.warn(`Unknown argument: ${arg}`);
        break;
      }
    }
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage: npm run release:evidence -- [options]

Options:
  -r, --run-id <id>     Explicit GitHub Actions run ID to capture.
  -w, --workflow <name> Workflow file or name to search (default: ${WORKFLOW_DEFAULT}).
  -b, --branch <name>   Filter runs by branch when resolving latest run.
      --skip-dry-run    Skip executing semantic-release dry run (useful for CI dry runs).
  -h, --help            Show this message.
`);
}

function captureEvidence() {
  const args = parseArgs(process.argv);

  ensureGhAvailable();
  const authStatus = checkGhAuth();

  const resolvedRunId = resolveRunId(args.workflow, args.branch, args.runId);
  const timestamp = formatTimestamp();
  const paths = buildEvidencePaths(resolvedRunId, timestamp);

  fs.mkdirSync(paths.baseDir, { recursive: true });

  writeFile(paths.authStatus, authStatus.trim());

  captureRunMetadata(resolvedRunId, paths.metadata);

  captureRunLogs(resolvedRunId, paths.log);

  fs.mkdirSync(paths.artifactsDir, { recursive: true });
  const artifactsDownloaded = downloadRunArtifacts(resolvedRunId, paths.artifactsDir);

  let dryRunCaptured = false;
  if (args.skipDryRun) {
    console.log('Skipping semantic-release dry run (flagged by user).');
  } else {
    runSemanticReleaseDryRun(paths.dryRun);
    dryRunCaptured = true;
  }

  console.log('Captured release evidence:');
  console.log(`  Run ID: ${resolvedRunId}`);
  console.log(`  Metadata: ${path.relative(process.cwd(), paths.metadata)}`);
  console.log(`  Logs: ${path.relative(process.cwd(), paths.log)}`);
  console.log(`  Auth status: ${path.relative(process.cwd(), paths.authStatus)}`);
  if (artifactsDownloaded) {
    console.log(`  Artifacts: ${path.relative(process.cwd(), paths.artifactsDir)}`);
  } else {
    console.log('  Artifacts: none downloaded (no artifacts found)');
  }
  console.log(
    `  Dry run: ${dryRunCaptured ? 'captured semantic-release dry run output' : 'skipped by flag'}`,
  );
}

if (require.main === module) {
  try {
    captureEvidence();
  } catch (error) {
    console.error(`[error] ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  formatTimestamp,
  resolveRunId,
  buildEvidenceDirectory,
  buildEvidencePaths,
};
