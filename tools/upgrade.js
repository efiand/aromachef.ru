import { createRequire } from 'module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { devDependencies } = require('../package.json');

execSync(`npm i -DE ${Object.keys(devDependencies).join('@latest ')}@latest`);
