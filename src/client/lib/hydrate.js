import { loadScript } from "#client/lib/load-script.js";

/** @type {(element: HTMLElement, data: object, template: string) => Promise<void>} */
export async function hydrate(element, data, template) {
	if (typeof PetiteVue === "undefined") {
		await loadScript("/vendors/petite-vue.iife.js");
	}
	element.innerHTML = template;
	PetiteVue.createApp(data).mount(element);
}
