/** @type {(overrides?: Partial<RouteParams>) => RouteParams} */
export function createRouteParams(overrides = {}) {
	return {
		body: {},
		id: Number.NaN,
		isAuthorized: false,
		req: /** @type {RouteRequest} */ ({}),
		res: /** @type {RouteResponse} */ ({}),
		...overrides,
	};
}
