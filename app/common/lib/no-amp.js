const noAmpRoutes = ['/__', '/admin', '/api', '/search', '/sitemap.xml'];

export function noAmp(pathname = '') {
	return noAmpRoutes.some((item) => pathname.startsWith(item));
}
