const path = require('node:path');
const fs = require('fs-extra');

const packageRoot = path.resolve(__dirname, '..');
const resources = ['bmad-core', 'common', 'docs', 'expansion-packs'];

for (const resource of resources) {
  const destination = path.join(packageRoot, resource);

  try {
    if (fs.existsSync(destination)) {
      fs.removeSync(destination);
      console.log(`✓ Cleaned ${resource} from package directory`);
    }
  } catch (error) {
    console.error(`Failed to clean ${resource} after packaging`, error);
    process.exitCode = 1;
  }
}
