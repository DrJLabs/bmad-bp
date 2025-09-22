const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const repoUrl = process.env.DRJ_BMAD_REPO_URL || 'https://github.com/DrJLabs/bmad-bp.git';
const repoRef = process.env.DRJ_BMAD_REPO_REF || 'main';
const cacheDir = process.env.DRJ_BMAD_CACHE_DIR || path.join(os.homedir(), '.cache', 'drj-bmad');

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function runGit(args, errorMessage) {
  const result = spawnSync('git', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(errorMessage);
    process.exit(result.status ?? 1);
  }
}

function updateRepository() {
  ensureDirectory(path.dirname(cacheDir));

  if (!fs.existsSync(cacheDir)) {
    console.log(`Cloning ${repoUrl} (${repoRef}) into ${cacheDir}...`);
    runGit(
      ['clone', '--depth=1', '--branch', repoRef, repoUrl, cacheDir],
      'Failed to clone repository.',
    );
    return;
  }

  console.log(`Updating ${cacheDir} from ${repoUrl} (${repoRef})...`);
  runGit(['-C', cacheDir, 'fetch', 'origin', repoRef], 'Failed to fetch latest changes.');
  runGit(['-C', cacheDir, 'checkout', repoRef], 'Failed to checkout requested ref.');
  runGit(
    ['-C', cacheDir, 'reset', '--hard', `origin/${repoRef}`],
    'Failed to sync repository to latest commit.',
  );
}

function ensureDependencies() {
  const packageJsonPath = path.join(cacheDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`package.json not found in ${cacheDir}.`);
    process.exit(1);
  }

  const lockFilePath = path.join(cacheDir, 'package-lock.json');
  const hasLockFile = fs.existsSync(lockFilePath);
  const npmArgs = hasLockFile ? ['ci', '--omit=dev'] : ['install', '--omit=dev'];
  console.log(`Installing BMAD dependencies (npm ${npmArgs[0]} ${npmArgs.slice(1).join(' ')})...`);
  const env = {
    ...process.env,
    HUSKY: '0',
    npm_config_audit: 'false',
    npm_config_fund: 'false',
  };
  const result = spawnSync('npm', npmArgs, {
    cwd: cacheDir,
    stdio: 'inherit',
    env,
  });

  if (result.status !== 0) {
    console.error('Failed to install dependencies.');
    process.exit(result.status ?? 1);
  }
}

function runInstaller(argv) {
  const cliPath = path.join(cacheDir, 'tools', 'installer', 'bin', 'bmad.js');
  if (!fs.existsSync(cliPath)) {
    console.error(`Installer entrypoint not found at ${cliPath}.`);
    process.exit(1);
  }

  const invocationCwd = process.env.BMAD_INVOCATION_CWD || process.env.INIT_CWD || process.cwd();
  const env = { ...process.env, BMAD_INVOCATION_CWD: path.resolve(invocationCwd) };
  const result = spawnSync('node', [cliPath, ...argv], { stdio: 'inherit', env });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

updateRepository();
ensureDependencies();
runInstaller(process.argv.slice(2));
