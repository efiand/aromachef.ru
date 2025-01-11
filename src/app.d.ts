// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Item } from './types';

declare global {
	namespace App {
		interface PageData {
			entity?: Item;
			items?: Item[];
			recipe?: {
				cooking: string;
				ingredients: string;
				structure: Item;
				tags: {
					tag: Item;
				}[];
				title: string;
			};
			tags?: Item[];
			title: string;
		}
	}
}

export {};
