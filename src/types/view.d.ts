declare global {
	type ArticleData = {
		alt?: string;
		content?: string;
		imageAlias: string;
		isSchemaSupport?: boolean;
		itemprop?: string;
		reverse?: boolean;
		title?: string;
	};

	type ArticleFooter = {
		recipes?: DbItem[];
		relatedArticles?: DbItem[];
	};

	type CardAdditionals = {
		alt?: string;
		route?: string;
	};

	type CardsData = CardAdditionals & {
		cards?: DbItem[];
		className?: string;
	};

	type ImageParams = {
		alt: string;
		className?: string;
		height: number;
		imageAlias: string;
		isSchemaSupport?: boolean;
		width: number;
	};

	type LayoutData = {
		description?: string;
		headTemplate?: string;
		heading?: string;
		isAuthorized?: boolean;
		isDev?: boolean;
		ogImage?: string;
		ogImageHeight?: string | number;
		ogImageWidth?: string | number;
		pageTemplate?: string;
		pathname?: string;
	};

	type PageSectionData = {
		alt?: string;
		articles?: ArticleData[];
		className?: string;
		content?: string;
		footerTemplate?: string;
		imageAlias?: string;
		itempropMeta?: string;
		itemtype?: string;
		next?: string;
		prev?: string;
		publishedAt?: string | null;
		title: string;
	};

	type RecipeFooter = {
		relatedRecipes?: DbItem[];
		structure: DbItem;
		tags: DbItem[];
	};

	type SelectParams = {
		endpoint?: string;
		isAddingSupport?: boolean;
		isEmptySupport?: boolean;
		isRequired?: boolean;
		label?: string;
		name: string;
		options: DbItem[];
		selectedValues?: (number | string)[];
	};

	type StaticPageData = {
		content: string;
		description: string;
		heading: string;
	};

	type StructureData = {
		alt?: string;
		asideHeading: string;
		asideId?: string;
		asyncSupport?: boolean;
		cards: DbItem[];
		heading: string;
		route?: string;
		structures?: DbItem[];
		tags?: DbItem[];
	};

	type TagTemplateData = {
		className?: string;
		column?: boolean;
		tags: DbItem[];
	};

	type TextareaParams = {
		className?: string;
		isArticle?: boolean;
		isEditor?: boolean;
		isRequired?: boolean;
		label?: string;
		maxlength?: number;
		name: string;
		rows?: number;
		value?: string | null;
	};
}

export {};
