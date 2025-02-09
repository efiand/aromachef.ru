// See https://svelte.dev/docs/kit/types#app.d.ts

import type { EnrichedRecipe, Item } from '@/types';

declare global {
	namespace App {
		interface PageData {
			content?: string;
			description: string;
			entity?: Item;
			items?: Item[];
			ogImage?: string;
			recipe?: EnrichedRecipe;
			tags?: Item[];
			title: string;
		}
	}
}

export {};
