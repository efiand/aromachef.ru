export const capitalize = (text = "") => {
	return `${text.slice(0, 1).toLocaleUpperCase()}${text.slice(1)}`;
};

export const highlight = (text = "", query = "") => {
	if (!query) {
		return text;
	}

	const regexp = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
	return text.replace(regexp, /* html */ `<mark>$1</mark>`);
};
