const path = require('node:path');

function getInvocationCwd() {
  // Explicit override for testing/integration
  if (process.env.BMAD_INVOCATION_CWD) return path.resolve(process.env.BMAD_INVOCATION_CWD);
  // npm/pnpm/yarn commonly set INIT_CWD to the original caller dir
  if (process.env.INIT_CWD) return path.resolve(process.env.INIT_CWD);
  // Fallback to current working directory
  return process.cwd();
}

module.exports = { getInvocationCwd };
