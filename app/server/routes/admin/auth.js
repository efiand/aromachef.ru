import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { setCookie } from "#server/lib/cookies.js";

const { AUTH_HASH, AUTH_LOGIN, AUTH_SECRET } = process.env;
const maxAge = 86_400;

export const authRoute = {
	/** @type {RouteMethod} */
	async GET({ authorized }) {
		return authorized ? { redirect: "/admin" } : getView();
	},

	/** @type {RouteMethod} */
	async POST({ body, res }) {
		const { login, password } = /** @type {{ login: string; password: string; }} */ (body);

		if (login !== AUTH_LOGIN) {
			return getView("Неверный логин!");
		}

		const compared = await compare(password, AUTH_HASH);
		if (!compared) {
			return getView("Неверный пароль!", login);
		}

		const authToken = jwt.sign({ authedUser: AUTH_LOGIN }, AUTH_SECRET, { expiresIn: "24h" });
		setCookie(res, { maxAge, name: "authToken", value: authToken });

		return { redirect: "/admin" };
	},
};

function getView(error = "", login = "") {
	const template = /* html */ `
		<form class="auth" action="/admin/auth" method="post">
			<input
				name="login"
				type="text"
				value="${login}"
				placeholder="Логин *"
				aria-label="Логин"
				autofocus
				required
			>

			<div class="password-input" data-component="passwordInput">
				<input
					class="password-input__input"
					type="password"
					name="password"
					placeholder="Пароль *"
					aria-label="Пароль"
					required
				>
				<button class="password-input__button" type="button" aria-label="Видимость пароля"></button>
			</div>

			<button class="button" type="submit" data-component="submitter">Войти</button>

			${error ? /* html */ `<p class="auth__error _error">${error}</p>` : ""}
		</form>
	`;
	return { page: { heading: "Авторизация", pageTemplate: template } };
}
