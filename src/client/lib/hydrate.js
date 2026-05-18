import { loadScript } from '#client/lib/load-script.js';

/** @type {(element: HTMLElement, data: object, template: string) => Promise<void>} */
export async function hydrate(element, data, template) {
	if (!window.PetiteVue) {
		await loadScript('/vendors/petite-vue.js?v0.4.1');
	}
	element.innerHTML = template;
	window.PetiteVue.createApp(data).mount(element);
}
