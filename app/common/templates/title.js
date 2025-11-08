import { PROJECT_TITLE } from "#common/constants.js";

/** @type {(heading?: string) => string} */
export function renderDocumentTitle(heading) {
	return [heading, PROJECT_TITLE].filter(Boolean).join(" | ");
}
