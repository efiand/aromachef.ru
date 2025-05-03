import { createRequire } from 'module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { dependencies = {}, devDependencies = {} } = require('../package.json');

[dependencies, devDependencies].forEach((packages, i) => {
	const list = Object.keys(packages);
	if (list.length) {
		execSync(`npm i -${i ? 'D' : ''}E ${list.join('@latest ')}@latest`);
	}
});
