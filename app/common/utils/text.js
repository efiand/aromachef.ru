export const capitalize = (text = "") => {
	return `${text.slice(0, 1).toLocaleUpperCase()}${text.slice(1)}`;
};
