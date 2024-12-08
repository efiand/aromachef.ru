function match(param: string) {
	return /^\d+(-ingredients|-cooking)?@\dx\.webp$/.test(param);
}

export { match };
