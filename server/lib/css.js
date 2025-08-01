import { readFile } from "node:fs/promises";
import { cwd } from "#server/constants.js";

/** @type {Record<string, string>} */
const cache = {};

/** @type {(stylesheets: Stylesheet[]) => Promise<string>} */
export async function getCss(stylesheets) {
	/** @type {string[]} */
	await Promise.all(
		stylesheets.map(async ({ name }) => {
			if (!cache[name]) {
				try {
					cache[name] = await readFile(`${cwd}/public/css/${name}.css`, "utf-8");
				} catch (error) {
					cache[name] = `/* ${error} *'`;
				}
			}
		}),
	);

	return stylesheets
		.map(({ media, name }) => {
			if (cache[name] && media) {
				return `@media ${media} {${cache[name]}}`;
			}
			return cache[name];
		})
		.join("");
}
