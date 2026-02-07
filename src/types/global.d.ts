import type { TinyMCE } from "tinymce";

type MetrikaInitOptions = {
	clickmap?: boolean;
	trackLinks?: boolean;
	accurateTrackBounce?: boolean;
	webvisor?: boolean;
};

type MetrikaHitOptions = {
	title?: string;
	referer?: string;
};

type YandexMetrika = {
	(counterId: number, method: "init", options: MetrikaInitOptions): void;
	(counterId: number, method: "hit", url: string, options?: MetrikaHitOptions): void;
	// fallback на любые другие команды, если появятся
	(counterId: number, method: string, ...args: unknown[]): void;
};

declare global {
	interface Window {
		/** Очередь SPA hit-ов до загрузки tag.js */
		__metrikaHitsQueue?: {
			url: string;
			title?: string;
		}[];

		PetiteVue: {
			createApp: (data?: object | (() => object)) => { mount(HTMLElement): void };
			reactive?: <T extends object>(obj: T) => T;
			nextTick?: (cb: () => void) => void;
		};
		isDev?: boolean;
		tinymce: TinyMCE;

		/** Yandex.Metrika */
		ym?: YandexMetrika;
	}

	namespace NodeJS {
		interface ProcessEnv {
			AUTH_HASH: string;
			AUTH_LOGIN: string;
			AUTH_PASSWORD: string;
			AUTH_SECRET: string;
			DB_HOST: string;
			DB_NAME: string;
			DB_PASSWORD: string;
			DB_USER: string;
			DEV?: string;
			PORT: string;
			TG_ADMIN_ID: string;
			TG_AROMACHEF_ID: string;
			TG_TOKEN: string;
			YADISK_TOKEN: string;
		}
	}
}
