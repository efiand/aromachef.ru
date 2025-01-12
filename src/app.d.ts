// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Item } from './types';

declare global {
	namespace App {
		interface PageData {
			entity?: Item;
			items?: Item[];
			recipe?: {
				cooking: string;
				description: null | string;
				ingredients: string;
				structure: Item;
				tags: {
					tag: Item;
				}[];
				telegramId: null | number;
				title: string;
			};
			tags?: Item[];
			title: string;
		}
	}
}

export {};
