type BaseRecipe = {
	cooking: string;
	description: null | string;
	id?: number;
	ingredients: string;
	publishedAt?: null | string;
	telegramId: null | number;
	title: string;
};

type EnrichedRecipe<T = BaseRecipe | Recipe> = T & {
	enrichedDescription: string;
};

type Item = {
	id: number;
	title: string;
};

type ItemWrapper = {
	[key: string]: Item;
};

type Recipe = BaseRecipe & {
	structure: Item;
	tags: {
		tag: Item;
	}[];
};

export type { BaseRecipe, EnrichedRecipe, Item, ItemWrapper, Recipe };
