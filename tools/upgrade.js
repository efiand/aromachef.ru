import { execSync } from 'node:child_process';
import pkg from '../package.json' with { type: 'json' };

const { dependencies = {}, devDependencies = {} } = pkg;

[dependencies, devDependencies].forEach((packages, i) => {
	const list = Object.keys(packages);
	if (list.length) {
		const command = `npm i -${i ? 'D' : ''}E ${list.join('@latest ')}@latest && npx update-browserslist-db@latest --yes`;
		execSync(command, { stdio: 'ignore' });
	}
});
