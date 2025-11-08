const DEFAULT_TIMER_DELAY = 500;

/** @type {(callback: Function, timeoutDelay?: number ) => (params: unknown) => void} */
export const debounce = (callback, timeoutDelay = DEFAULT_TIMER_DELAY) => {
	/** @type {NodeJS.Timeout} */
	let timeoutId;

	return (...rest) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
	};
};
