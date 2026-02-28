declare global {
	type ArticleData = {
		alt?: string;
		content?: string;
		imageAlias: string;
		isAmp?: boolean;
		isSchemaSupport?: boolean;
		itemprop?: string;
		reverse?: boolean;
		title?: string;
	};

	type ArticleFooter = {
		isAmp?: boolean;
		recipes?: DbItem[];
		relatedArticles?: DbItem[];
	};

	type CardAdditionals = {
		alt?: string;
		isAmp?: boolean;
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
		isAmp?: boolean;
		isSchemaSupport?: boolean;
		width: number;
	};

	type LayoutData = {
		authorized?: boolean;
		description?: string;
		headTemplate?: string;
		heading?: string;
		isAmp?: boolean;
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
		isAmp?: boolean;
		itempropMeta?: string;
		itemtype?: string;
		next?: string;
		prev?: string;
		publishedAt?: string | null;
		title: string;
	};

	type RecipeFooter = {
		isAmp?: boolean;
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
		cards: DbItem[];
		heading: string;
		isAmp?: boolean;
		asyncSupport?: boolean;
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
		rows?: number;
		name: string;
		value?: string | null;
	};
}

export {};
