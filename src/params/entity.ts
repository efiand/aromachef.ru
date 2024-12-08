const entities = new Set(['recipe', 'structure']);

function match(param: string) {
	return entities.has(param);
}

export { match };
