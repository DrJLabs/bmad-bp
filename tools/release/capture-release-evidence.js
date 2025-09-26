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

const { Command } = require('commander');

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

/**
 * Format a Date into a compact UTC timestamp suitable for filenames.
 * @param {Date} [date=new Date()] - The date to format; defaults to the current time.
 * @returns {string} The timestamp in `YYYYMMDDTHHMMSSZ` format (UTC), for example `20250926T123456Z`.
 */
function formatTimestamp(date = new Date()) {
  return date
    .toISOString()
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Execute a subprocess synchronously and return its captured stdout and stderr.
 *
 * @param {string} command - The command to run.
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {Object} [options] - Additional options forwarded to `child_process.spawnSync`.
 * @returns {{stdout: string, stderr: string}} The subprocess stdout and stderr as UTF-8 strings.
 * @throws {Error} If spawning fails, throws the original spawn error. If the process exits with a non-zero status, throws an Error whose `code` is the exit status and which includes `stdout` and `stderr` properties.
 */
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

/**
 * Checks that the GitHub CLI is available.
 *
 * Throws an error if the GitHub CLI is not installed or not executable.
 * @throws {Error} If the `gh --version` command fails or returns a non-zero exit code.
 */
function ensureGhAvailable() {
  runCommand('gh', ['--version']);
}

/**
 * Verify that the GitHub CLI is authenticated for the current user.
 *
 * @throws {Error} If the `gh auth status` command fails (for example, when not authenticated or the command cannot run).
 */
function checkGhAuth() {
  runCommand('gh', ['auth', 'status']);
}

/**
 * Build the base evidence directory path for a given release run and timestamp.
 *
 * @param {string} runId - The release run identifier (databaseId or run id string).
 * @param {string} timestamp - Compact timestamp string (e.g., produced by formatTimestamp).
 * @returns {string} The absolute path to the evidence directory for that run and timestamp.
 * @throws {Error} If `runId` or `timestamp` is not provided.
 */
function buildEvidenceDirectory(runId, timestamp) {
  if (!runId) {
    throw new Error('runId is required to build evidence directory');
  }
  if (!timestamp) {
    throw new Error('timestamp is required to build evidence directory');
  }
  return path.join(EVIDENCE_ROOT, `release-run-${runId}-${timestamp}`);
}

/**
 * Builds file and directory paths for storing evidence related to a release workflow run.
 *
 * @param {string} runId - The GitHub Actions run identifier used in filenames.
 * @param {string} timestamp - Compact timestamp string inserted into time-stamped filenames.
 * @returns {{baseDir: string, authStatus: string, metadata: string, log: string, artifactsDir: string, dryRun: string}}
 * An object containing:
 * - `baseDir`: root evidence directory for the run and timestamp.
 * - `authStatus`: path to the file recording GitHub CLI authentication verification.
 * - `metadata`: path to the JSON file with run metadata.
 * - `log`: path to the run log file.
 * - `artifactsDir`: directory path where run artifacts are downloaded.
 * - `dryRun`: path to the semantic-release dry-run output log.
 */
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

/**
 * Resolve a GitHub Actions run database ID for the given workflow and optional branch, or return the supplied ID.
 *
 * If `providedId` is given, it is returned unchanged. Otherwise the function queries `gh run list` for the most
 * recent run matching `workflow` (and `branch` when provided) and returns that run's `databaseId`.
 *
 * @param {string} workflow - The workflow file name or identifier to search for (e.g., "release.yaml").
 * @param {string} [branch] - Optional branch name to filter runs by.
 * @param {string} [providedId] - Optional explicit run ID to use instead of querying GitHub.
 * @returns {string} The resolved run's database ID.
 * @throws {Error} If the JSON output from `gh` cannot be parsed.
 * @throws {Error} If no matching runs are found for the specified workflow and branch.
 */
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

/**
 * Write UTF-8 text to a file, ensuring the file's parent directories exist.
 * @param {string} filePath - Destination file path.
 * @param {string} contents - Text to write into the file.
 */
function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

/**
 * Download artifacts for a GitHub Actions run into a local directory.
 *
 * Attempts to download all artifacts for the specified run into `outputDir`.
 * @param {string} runId - The GitHub Actions run identifier (databaseId or run id).
 * @param {string} outputDir - Destination directory to store downloaded artifacts.
 * @returns {boolean} `true` if artifacts were downloaded, `false` if the run has no artifacts.
 * @throws {Error} Re-throws any error from the underlying command except the "no artifacts found" case.
 */
function downloadRunArtifacts(runId, outputDir) {
  try {
    runCommand('gh', ['run', 'download', runId, '--dir', outputDir]);
    return true;
  } catch (error) {
    const message = `${error.stderr || error.stdout || error.message}`;
    if (/no\s+([a-z\s]+\s)?artifacts?.*found/i.test(message)) {
      console.warn(`[warn] No artifacts found for run ${runId}.`);
      return false;
    }
    throw error;
  }
}

/**
 * Capture the GitHub Actions run log for the specified run and write it to a file.
 * @param {string} runId - The GitHub Actions run identifier (databaseId or run number) to retrieve logs for.
 * @param {string} destPath - Filesystem path where the retrieved log will be written (created if necessary).
 */
function captureRunLogs(runId, destPath) {
  const { stdout } = runCommand('gh', ['run', 'view', runId, '--log']);
  writeFile(destPath, stdout);
}

/**
 * Retrieve selected metadata for a workflow run and write it to a file as trimmed JSON.
 *
 * The written JSON includes the following fields: `conclusion`, `databaseId`, `headBranch`,
 * `headSha`, `workflowName`, `event`, `createdAt`, `updatedAt`, `url`, `htmlUrl`, and `status`.
 *
 * @param {string} runId - The identifier of the workflow run to capture metadata for.
 * @param {string} destPath - File path where the trimmed JSON metadata will be written.
 */
function captureRunMetadata(runId, destPath) {
  const { stdout } = runCommand('gh', [
    'run',
    'view',
    runId,
    '--json',
    'conclusion,databaseId,headBranch,headSha,workflowName,event,createdAt,updatedAt,url,status,displayTitle',
  ]);
  writeFile(destPath, `${stdout.trim()}`);
}

/**
 * Runs a semantic-release dry run and writes its stdout to the given destination file.
 *
 * Executes `npx semantic-release --dry-run` with CI disabled and persists the command output to destPath.
 * @param {string} destPath - File path where the semantic-release dry-run stdout will be written.
 * @throws {Error} If the spawn fails (process error) or the command exits with a non-zero status; the thrown error's message contains command output and `err.code` is set to the exit status when available.
 */
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

/**
 * Create a configured CLI program for capturing release evidence.
 *
 * The returned Command is named `release:evidence`, includes a description, and provides options to:
 * - specify an explicit run ID (`-r, --run-id`)
 * - select a workflow (`-w, --workflow`, default: WORKFLOW_DEFAULT)
 * - filter by branch (`-b, --branch`)
 * - skip the semantic-release dry run (`--skip-dry-run`)
 * The program is configured to show help after errors.
 *
 * @returns {Command} A Commander `Command` instance configured for the release:evidence CLI.
 */
function createProgram() {
  return new Command()
    .name('release:evidence')
    .description(
      'Capture GitHub Actions evidence and semantic-release dry-run output for Story 1.4.',
    )
    .option('-r, --run-id <id>', 'Explicit GitHub Actions run ID to capture.')
    .option('-w, --workflow <name>', 'Workflow file or name to search.', WORKFLOW_DEFAULT)
    .option('-b, --branch <name>', 'Filter runs by branch when resolving latest run.')
    .option('--skip-dry-run', 'Skip executing semantic-release dry run.')
    .showHelpAfterError();
}

/**
 * Parse command-line arguments and return normalized options for the script.
 *
 * @param {string[]} argv - The argument vector to parse (typically `process.argv`).
 * @returns {{runId: string|undefined, workflow: string, branch: string|undefined, skipDryRun: boolean}} Parsed options:
 *  - runId: explicit run ID if provided.
 *  - workflow: workflow filename or name (defaults to `release.yaml`).
 *  - branch: optional branch filter.
 *  - skipDryRun: `true` if the semantic-release dry run should be skipped.
 * @throws {Error} If command-line parsing fails (help is handled and causes process exit instead).
 */
function parseArgs(argv) {
  const program = createProgram();
  program.exitOverride((err) => {
    // Commander throws on help or parsing errors; allow help to exit gracefully.
    if (err.code === 'commander.helpDisplayed') {
      process.exit(0);
    }
    throw err;
  });

  const parsed = program.parse(argv, { from: 'node' }).opts();
  return {
    runId: parsed.runId,
    workflow: parsed.workflow || WORKFLOW_DEFAULT,
    branch: parsed.branch,
    skipDryRun: Boolean(parsed.skipDryRun),
  };
}

/**
 * Orchestrates gathering release evidence from GitHub Actions into a timestamped evidence directory.
 *
 * Verifies GitHub CLI availability and authentication, resolves a workflow run ID (explicit or latest matching workflow/branch),
 * captures run metadata and logs, attempts to download run artifacts, records an auth verification file, and optionally
 * runs a local semantic-release dry run. All outputs are written under a timestamped evidence directory for the resolved run.
 */
function captureEvidence() {
  const args = parseArgs(process.argv);

  ensureGhAvailable();
  checkGhAuth();

  const resolvedRunId = resolveRunId(args.workflow, args.branch, args.runId);
  const timestamp = formatTimestamp();
  const paths = buildEvidencePaths(resolvedRunId, timestamp);

  fs.mkdirSync(paths.baseDir, { recursive: true });

  writeFile(paths.authStatus, 'GitHub CLI authentication verified.');

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
