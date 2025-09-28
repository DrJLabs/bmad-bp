const path = require('node:path');
const fs = require('fs-extra');

const projectRoot = path.resolve(__dirname, '..', '..');
const packageRoot = path.resolve(__dirname, '..');
const resources = ['bmad-core', 'common', 'docs', 'expansion-packs'];

for (const resource of resources) {
  const source = path.join(projectRoot, resource);
  const destination = path.join(packageRoot, resource);

  if (!fs.existsSync(source)) {
    console.warn(`⚠️  Prepack warning: missing source directory "${resource}" at ${source}`);
    continue;
  }

  try {
    fs.removeSync(destination);
    fs.copySync(source, destination, { dereference: true });
    console.log(`✓ Copied ${resource} to package directory`);
  } catch (error) {
    console.error(`Failed to prepare ${resource} for packaging`, error);
    process.exitCode = 1;
  }
}
