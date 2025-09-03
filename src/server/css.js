import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { cwd } from "#server/constants.js";
import postcssConfig from "../../postcss.config.js";

/** @type {(entryPoint: string) => Promise<string>} */
export async function getCss(entryPoint) {
	const from = `${cwd}/src/client/css/${entryPoint}`;
	const cssCode = await readFile(from, "utf-8");

	return (await postcss(postcssConfig.plugins).process(cssCode, { from })).css;
}
