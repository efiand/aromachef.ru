/** Минификация для служебного пользования (только устранение DX-"сахара") */
function minifyInternal(source: string) {
	return source.replace(/\t|\n+|<!--.*?-->/g, '');
}

export { minifyInternal };
