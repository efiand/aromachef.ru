declare global {
	type Article = {
		content: string;
		description: string;
		title: string;
	};

	type ArticleCache = {
		oldRecipeIds: number[];
		oldRelatedIds: number[];
	};

	type ArticleInAdmin = ArticleInForm & {
		articles: DbItem[];
		id: number;
		recipes: DbItem[];
		recipeIds: number[];
		relatedIds: number[];
	};

	type ArticleInForm = Article & { published: boolean };

	type DbItem = {
		current?: boolean;
		id: number;
		title: string;
	};

	type DbTable =
		| "articles"
		| "articlesArticles"
		| "articlesRecipes"
		| "comments"
		| "recipes"
		| "recipesRecipes"
		| "recipesTags"
		| "staticPages"
		| "structures"
		| "tags";

	type PostedArticle = {
		/** Сериализованные данные о предыдущих связях с рецептами и статьями и рецептами */
		cache: string;

		content: string;
		contentImage?: string;
		description: string;
		id: string;
		published: string;
		"recipeIds[]": string[];
		"relatedIds[]": string[];
		title: string;
	};

	type PostedComment = {
		name?: string;
		text: string;
	};

	type PostedRecipe = {
		/** Сериализованные данные о предыдущих связях с тегами и рецептами */
		cache: string;

		cooking: string;
		cookingImage?: string;
		description: string;
		id: string;
		ingredients: string;
		ingredientsExtra: string;
		ingredientsImage?: string;
		published: string;
		"relatedIds[]": string[];
		structureId: string;
		"tagIds[]": string[];
		telegramId: string;
		title: string;
	};

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

	type RecipeCache = {
		oldRelatedIds: number[];
		oldTagIds: number[];
	};

	type RecipeComment = {
		id: number;
		name: string;
		text: string;
		answer: string | null;
	};

	type RecipeCommentInForm = Omit<RecipeComment, "id"> & {
		action?: string;
		published: boolean;
		recipeId: number | string;
		recipeTitle: string;
	};

	type RecipeInForm = Omit<Recipe, "structureTitle"> & { published: boolean };

	type RecipeInAdmin = RecipeInForm & {
		id: number;
		recipes: DbItem[];
		relatedIds: number[];
		structures: DbItem[];
		tagIds: number[];
		tags: DbItem[];
	};
}

export {};
