type Options = { [key: string]: boolean | number | string };
type YM =
	| ((
			ymId: number,
			action: string,
			payload?: Options | string,
			options?: Options
	  ) => void)
	| undefined;

const YM_ID = 99498629;
let doYM: YM = undefined;

function hitYM(options: Options = {}, url = window.location.href) {
	initYM();
	if (doYM) {
		doYM(YM_ID, 'hit', url, options);
	}
}

function initYM() {
	if (doYM) {
		return;
	}

	doYM = ((window || {}) as unknown as { ym: YM }).ym;
	if (doYM) {
		doYM(YM_ID, 'init', {
			accurateTrackBounce: true,
			clickmap: true,
			defer: true,
			trackLinks: true,
			webvisor: true
		});
	}
}

export { hitYM };
