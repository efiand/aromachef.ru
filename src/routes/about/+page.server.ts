import { aboutData } from '@/data/about';

const prerender = true;

function load() {
	return aboutData;
}

export { load, prerender };
