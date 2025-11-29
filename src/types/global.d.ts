import type { TinyMCE } from "tinymce";

declare global {
	interface Window {
		PetiteVue: {
			createApp: (data?: object | (() => object)) => { mount(HTMLElement): void };
			reactive?: <T extends object>(obj: T) => T;
			nextTick?: (cb: () => void) => void;
		};
		isDev?: boolean;
		tinymce: TinyMCE;
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
