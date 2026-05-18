CREATE DATABASE aromachef
	DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_general_ci;
USE aromachef;

-- Порядок создания таблиц ВАЖЕН

CREATE TABLE structures (
	id int auto_increment NOT NULL,
	title varchar(500) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT structures_title_key UNIQUE KEY (title)
)
COMMENT='Разделы сайта.';

CREATE TABLE articles (
	id int auto_increment NOT NULL,
	title varchar(100) NOT NULL,
	description varchar(1000) NOT NULL,
	content text NOT NULL,
	published tinyint DEFAULT 0 NOT NULL,
	publishedAt datetime(3),
	updatedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT articles_title_key UNIQUE KEY (title)
)
COMMENT='Статьи.';

CREATE TABLE articlesArticles (
	id int auto_increment NOT NULL,
	articleId int NOT NULL,
	relatedArticleId int NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT articlesArticles_articleId_relatedArticleId_key UNIQUE KEY (articleId, relatedArticleId),
	CONSTRAINT articlesArticles_articleId_fkey FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT articlesArticles_relatedArticleId_fkey FOREIGN KEY (relatedArticleId) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE
)
COMMENT='Кросс-таблица связей одних статей с другими.';
CREATE INDEX articlesArticles_articleId_idx USING BTREE ON articlesArticles (articleId);
CREATE INDEX articlesArticles_relatedArticleIdidx USING BTREE ON articlesArticles (relatedArticleId);

CREATE TABLE recipes (
	id int auto_increment NOT NULL,
	title varchar(100) NOT NULL,
	description varchar(1000) NOT NULL,
	ingredients varchar(3000) NOT NULL,
	ingredientsExtra varchar(1000),
	cooking varchar(3000) NOT NULL,
	structureId int NOT NULL,
	telegramId int,
	published tinyint DEFAULT 0 NOT NULL,
	publishedAt datetime(3),
	updatedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipes_telegramId_key UNIQUE KEY (telegramId),
	CONSTRAINT recipes_title_key UNIQUE KEY (title),
	CONSTRAINT recipes_structureId_fkey FOREIGN KEY (structureId) REFERENCES structures(id) ON DELETE RESTRICT ON UPDATE CASCADE
)
COMMENT='Рецепты.';
CREATE INDEX recipes_structureId_idx USING BTREE ON recipes (structureId);

CREATE TABLE recipesRecipes (
	id int auto_increment NOT NULL,
	recipeId int NOT NULL,
	relatedRecipeId int NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipesRecipes_recipeId_relatedRecipeId_key UNIQUE KEY (recipeId, relatedRecipeId),
	CONSTRAINT recipesRecipes_recipeId_fkey FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT recipesRecipes_relatedRecipeId_fkey FOREIGN KEY (relatedRecipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
)
COMMENT='Кросс-таблица связей одних рецептов с другими.';
CREATE INDEX recipesRecipes_recipeId_idx USING BTREE ON recipesRecipes (recipeId);
CREATE INDEX recipesRecipes_relatedRecipeIdidx USING BTREE ON recipesRecipes (relatedRecipeId);

CREATE TABLE articlesRecipes (
	id int auto_increment NOT NULL,
	articleId int NOT NULL,
	recipeId int NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT articlesRecipes_articleId_recipeId_key UNIQUE KEY (articleId, recipeId),
	CONSTRAINT articlesRecipes_articleId_fkey FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT articlesRecipes_recipeId_fkey FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
)
COMMENT='Кросс-таблица связи статей с рецептами.';
CREATE INDEX articlesRecipes_articleId_idx USING BTREE ON articlesRecipes (articleId);
CREATE INDEX articlesRecipes_recipeId_idx USING BTREE ON articlesRecipes (recipeId);

CREATE TABLE tags (
	id int auto_increment NOT NULL,
	title varchar(50) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT tags_title_key UNIQUE KEY (title)
)
COMMENT='Теги рецептов.';

CREATE TABLE recipesTags (
	id int auto_increment NOT NULL,
	recipeId int NOT NULL,
	tagId int NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipesTags_recipeId_tagId_key UNIQUE KEY (recipeId, tagId),
	CONSTRAINT recipesTags_recipeId_fkey FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT recipesTags_tagId_fkey FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
)
COMMENT='Кросс-таблица связи рецептов с тегами.';
CREATE INDEX recipesTags_recipeId_idx USING BTREE ON recipesTags (recipeId);
CREATE INDEX recipesTags_tagId_idx USING BTREE ON recipesTags (tagId);

CREATE TABLE comments (
	id int auto_increment NOT NULL,
	name varchar(100) DEFAULT 'Гость' NOT NULL,
	text varchar(3000) NOT NULL,
	answer varchar(3000),
	recipeId int NOT NULL,
	published tinyint DEFAULT 0 NOT NULL,
	publishedAt datetime(3),
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT comments_recipeId_fkey FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
)
COMMENT='Комментарии пользователей к рецептам.';
CREATE INDEX comments_recipeId_idx USING BTREE ON comments (recipeId);

CREATE TABLE staticPages(
	id int auto_increment NOT NULL,
	title varchar(100) NOT NULL,
	pathname varchar(100) NOT NULL,
	description varchar(1000) NOT NULL,
	content varchar(10000),
	publishedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	updatedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT staticPages_title_key UNIQUE KEY (title),
	CONSTRAINT staticPages_pathname_key UNIQUE KEY (pathname)
)
COMMENT='Содержимое статических страниц.';
