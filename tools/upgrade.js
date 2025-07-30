import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { dependencies = {}, devDependencies = {} } = require("../package.json");

[dependencies, devDependencies].forEach((packages, i) => {
	const list = Object.keys(packages);
	if (list.length) {
		execSync(`npm i -${i ? "D" : ""}E ${list.join("@latest ")}@latest`);
	}
});
