import { BASE_URL, PROJECT_DESCRIPTION, PROJECT_TITLE } from "#!/constants.js";
import { renderRecipeDescription } from "#!/templates/recipe-description.js";
import { html, sql, xml } from "#!/utils/mark-template.js";
import { getFromDb } from "#server/lib/db.js";

const query = sql`
	SELECT
		CONCAT('${BASE_URL}/recipe/', id) AS link,
		title,
		description,
		CONCAT('<h2>Состав</h2>', ingredients, '<h2>Приготовление</h2>', cooking) AS content,
		telegramId,
		DATE_FORMAT(publishedAt, '%a, %d %b %Y %H:%i:%s +0300') AS pubDate
		FROM recipes
		WHERE published = 1
	UNION
	SELECT
		CONCAT('${BASE_URL}', pathname) AS link,
		title,
		CONCAT('<p>', description, '</p>') AS description,
		content,
		null AS telegramId,
		DATE_FORMAT(publishedAt, '%a, %d %b %Y %H:%i:%s +0300') AS pubDate
		FROM staticPages
	ORDER BY link;
`;

/** @type {(page: TurboPage) => string} */
function renderTurboPage({ description, content, link, pubDate, telegramId, title }) {
	const data = html`
		<header>
			<h1>${title}</h1>
		</header>
		${renderRecipeDescription({ description, telegramId })}
		${content}
	`;

	return xml`
		<item turbo="true">
			<turbo:extendedHtml>true</turbo:extendedHtml>
			<link>${link}</link>
			<turbo:content><![CDATA[${data}]]></turbo:content>
			<pubDate>${pubDate}</pubDate>
		</item>
	`;
}

export const turboRssRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {TurboPage[]} */
		const pages = await getFromDb(query);

		return {
			contentType: "application/xml",
			template: xml`
				<?xml version="1.0" encoding="UTF-8" ?>
				<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">
					<channel>
						<title>${PROJECT_TITLE}</title>
						<description>${PROJECT_DESCRIPTION}</description>
						<link>${BASE_URL}</link>
						<language>ru</language>
						${pages.map(renderTurboPage).join("")}
					</channel>
				</rss>
			`,
		};
	},
};
