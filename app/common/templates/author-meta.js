/** @type {(publishedAt?: string?) => string} */
export function renderAuthorMeta(publishedAt = null) {
	return /* html */ `
		<div itemscope itemtype="https://schema.org/Person" itemid="https://aromachef.ru/#author" hidden>
			<meta itemprop="name" content="АромаШеф">
			<link itemprop="url" href="https://aromachef.ru/about">
		</div>
		<link itemprop="author" href="https://aromachef.ru/#author">
		${publishedAt ? /* html */ `<meta itemprop="datePublished" content="${publishedAt}">` : ''}
	`;
}
