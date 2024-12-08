import sortMediaQueries from 'postcss-sort-media-queries';
import postcssUrl from 'postcss-url';

export default {
	plugins: [
		sortMediaQueries(),
		postcssUrl({
			filter: '**/icons/*',
			url: 'inline'
		})
	]
};
