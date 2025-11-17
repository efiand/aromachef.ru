declare global {
	type ArticleData = {
		isAmp?: boolean;
		alt?: string;
		content?: string;
		imageAlias: string;
		reverse?: boolean;
		title?: string;
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
		alt: string;
		imageAlias: string;
		isAmp?: boolean;
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
		articles?: ArticleData[];
		className?: string;
		content?: string;
		footerTemplate?: string;
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
