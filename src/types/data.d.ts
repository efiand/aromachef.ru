declare global {
	type DbItem = {
		current?: boolean;
		id: number;
		title: string;
	};

	type DbTable = "comments" | "recipes" | "recipesRecipes" | "recipesTags" | "staticPages" | "structures" | "tags";

	type Recipe = {
		cooking: string;
		description: string;
		ingredients: string;
		ingredientsExtra: string | null;
		structureId: number;
		structureTitle: string;
		telegramId?: number | null;
		title: string;
	};

	type RecipeComment = {
		id: number;
		name: string;
		text: string;
		answer: string | null;
	};

	type PostedComment = {
		name?: string;
		text: string;
	};

	type PostedRecipe = {
		cooking: string;
		cookingImage?: string;
		description: string;
		ingredients: string;
		ingredientsImage?: string;
		ingredientsExtra: string;
		published: string;
		"relatedIds[]": string[];
		structureId: string;
		"tagIds[]": string[];
		telegramId: string;
		title: string;
	};

	type RecipeInAdmin = Omit<Recipe, "structureTitle"> & {
		published: boolean;
		id: number;
		recipes: DbItem[];
		relatedIds: number[];
		structures: DbItem[];
		tagIds: number[];
		tags: DbItem[];
	};
}

export {};
