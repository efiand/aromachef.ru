interface Item {
	id: number;
	title: string;
}

interface ItemWrapper {
	[key: string]: Item;
}

export type { Item, ItemWrapper };
