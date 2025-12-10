import { initShare } from "#client/components/share.js";
import { hydrate } from "#client/lib/hydrate.js";

const endpoint = location.pathname.replace("/recipe/", "/comments/");

const data = {
	/** @type {RecipeComment[]} */
	comments: [],
	async fetchComments() {
		const res = await fetch(endpoint);

		/** @type {{ comments: RecipeComment[] }} */
		const { comments } = await res.json();
		this.comments = comments;
	},
	firstOpening: true,
	hasError: false,
	mounted() {
		setInterval(this.fetchComments, 180_000);
		initShare("comments");
	},
	name: "",
	/** @type {(event: SubmitEvent) => Promise<void>} */
	async onSubmit(event) {
		event.preventDefault();

		this.hasError = false;
		this.posting = true;

		const body = new FormData();
		body.append("name", this.name);
		body.append("text", this.text);

		const res = await fetch(endpoint, { body, method: "POST" });

		if (res.ok) {
			this.successText = await res.text();
		} else {
			this.hasError = true;
		}
		this.posting = false;
	},
	onSuccess() {
		this.successText = "";
		this.text = "";
	},
	opened: false,
	posting: false,
	successText: "",
	text: "",
};

const TEMPLATE = /* html */ `
	<div class="comments" :class="{ 'comments--opened': opened }" @vue:mounted="mounted">
		<h2 class="comments__heading">Комментарии</h2>
		<button
			class="comments__toggler icon-button icon-button--comment"
			:aria-expanded="opened"
			aria-controls="comments-body"
			@click="opened = !opened"
		>
			<template v-if="opened">Скрыть</template>
			<template v-else-if="comments.length">Комментарии ({{ comments.length }})</template>
			<template v-else>Комментарии</template>
		</button>
		<div class="comments__body" id="comments-body">
			<ul class="comments__list" v-if="comments.length">
				<li v-for="{ answer, id, name, text } in comments" :key="id">
					<figure
						class="comments__item"
						itemscope
						itemtype="https://schema.org/Comment"
					>
						<figcaption class="comments__author" itemprop="author">{{ name }}</figcaption>
						<blockquote class="comments__quote" itemprop="text" v-html="text"></blockquote>
					</figure>
					<figure
						class="comments__item comments__item--answer"
						v-if="answer"
						itemscope
						itemtype="https://schema.org/Comment"
					>
						<figcaption class="comments__author">
							<a href="/about" itemprop="author" rel="author">АромаШеф</a>
						</figcaption>
						<blockquote class="comments__quote" itemprop="text" v-html="answer"></blockquote>
					</figure>
				</li>
			</ul>
			<div class="comments__form" v-if="successText">
				<div v-html="successText"></div>
				<button class="comments__button button" type="button" @click="onSuccess">
					Отправить ещё
				</button>
			</div>
			<form class="comments__form" v-else ref="formElement" @submit="onSubmit">
				<input class="comments__name" v-model="name" aria-label="Имя" placeholder="Введите имя">
				<textarea
					v-model="text"
					rows="5"
					aria-label="Текст"
					placeholder="Напишите комментарий (до 3000 символов) *"
					maxlength="3000"
					required
				></textarea>
				<button
					class="comments__button button"
					type="submit"
					:data-loading="posting ? '' : undefined"
				>
					Отправить
				</button>
				<p class="comments__error _error" v-if="hasError">Произошла ошибка.</p>
			</form>
		</div>
	</div>
`;

/** @param {HTMLElement} element */
export async function initComments(element) {
	await data.fetchComments();
	hydrate(element, data, TEMPLATE);
}
