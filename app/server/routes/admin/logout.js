import { deleteCookie } from "#server/lib/cookies.js";

export const logoutRoute = {
	/** @type {RouteMethod} */
	async GET({ res }) {
		deleteCookie(res, "authToken");
		return { redirect: "/" };
	},
};
