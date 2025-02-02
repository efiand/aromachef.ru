import { importantData } from '@/data/important';

const prerender = true;

function load() {
	return importantData;
}

export { load, prerender };
