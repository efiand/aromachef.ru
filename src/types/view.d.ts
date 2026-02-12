declare global {
	type ArticleData = {
		imageAlias: string;
		isAmp?: boolean;
		alt?: string;
		content?: string;
		reverse?: boolean;
		title?: string;
	};

	type ArticleFooter = {
		isAmp?: boolean;
		recipes?: DbItem[];
		relatedArticles?: DbItem[];
	};

	type CardAdditionals = {
		isAmp?: boolean;
		alt?: string;
		route?: string;
	};

	type CardsData = CardAdditionals & {
		cards?: DbItem[];
		className?: string;
	};

	type ImageParams = {
		className?: string;
		imageAlias: string;
		isAmp?: boolean;
		alt: string;
		height: number;
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
		next?: string;
		prev?: string;
		title: string;
	};

	type RecipeFooter = {
		isAmp?: boolean;
		relatedRecipes?: DbItem[];
		structure: DbItem;
		tags: DbItem[];
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
}

export {};
