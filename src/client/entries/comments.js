import { initComments } from "#client/components/comments.js";

/** @type {NodeListOf<HTMLDivElement>} */
const commentsElements = document.querySelectorAll("[data-comments]");
// Гидратация блока комментариев
commentsElements.forEach(initComments);
