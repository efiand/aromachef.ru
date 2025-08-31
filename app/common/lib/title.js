import { PROJECT_TITLE } from "#!/common/constants.js";

/** @type {(heading?: string) => string} */
export function renderDocumentTitle(heading) {
	return [PROJECT_TITLE, heading].filter(Boolean).join(" : ");
}
