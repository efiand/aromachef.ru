declare global {
	type ErrorCause = {
		/** HTTP статус (если применимо) */
		status?: number;
	};

	interface Error {
		cause?: ErrorCause | number | string;
	}

	type LogLevel = "error" | "info" | "warn";
}

export {};
