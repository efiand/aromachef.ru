type BaseRecipe = {
	cooking: string;
	description: string;
	id?: number;
	ingredients: string;
	publishedAt?: Date | null;
	telegramId: null | number;
	title: string;
};

type EnrichedRecipe = Recipe & {
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
