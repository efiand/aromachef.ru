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
CREATE INDEX comments_srecipeId_idx USING BTREE ON comments (recipeId);

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
