declare global {
	type ComponentInitiator = (element: HTMLElement) => void | Promise<void>;

	type ShareItem = {
		id: string;
		title: string;
		url: string;
	};
}

export {};
