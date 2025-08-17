CREATE DATABASE aromachef;

CREATE TABLE comments (
	id int(11) auto_increment NOT NULL,
	name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Гость' NOT NULL,
	text varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	recipeId int(11) NOT NULL,
	published tinyint(1) DEFAULT 0 NOT NULL,
	publishedAt datetime(3) DEFAULT NULL NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT comments_recipeId_fkey FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Комментарии пользователей к рецептам.';
CREATE INDEX comments_srecipeId_idx USING BTREE ON comments (recipeId);

CREATE TABLE recipes (
	id int(11) auto_increment NOT NULL,
	title varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	description varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	ingredients varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	cooking varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	structureId int(11) NOT NULL,
	telegramId int(11) DEFAULT NULL NULL,
	published tinyint(1) DEFAULT 0 NOT NULL,
	publishedAt datetime(3) DEFAULT NULL NULL,
	updatedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipes_cooking_key UNIQUE KEY (cooking),
	CONSTRAINT recipes_description_key UNIQUE KEY (description),
	CONSTRAINT recipes_ingredients_key UNIQUE KEY (ingredients),
	CONSTRAINT recipes_telegramId_key UNIQUE KEY (telegramId),
	CONSTRAINT recipes_title_key UNIQUE KEY (title),
	CONSTRAINT recipes_structureId_fkey_copy FOREIGN KEY (structureId) REFERENCES structures(id) ON DELETE RESTRICT ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='';
CREATE INDEX recipes_structureId_idx USING BTREE ON recipes (structureId);

CREATE TABLE recipesTags (
	id int(11) auto_increment NOT NULL,
	recipeId int(11) NOT NULL,
	tagId int(11) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipesTags_recipeId_tagId_key UNIQUE KEY (recipeId,tagId),
	CONSTRAINT recipesTags_recipeId_fkey_copy FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT recipesTags_tagId_fkey_copy FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='';
CREATE INDEX recipesTags_recipeId_idx USING BTREE ON recipesTags (recipeId);
CREATE INDEX recipesTags_tagId_idx USING BTREE ON recipesTags (tagId);

CREATE TABLE recipesRecipes (
	id int(11) auto_increment NOT NULL,
	recipeId int(11) NOT NULL,
	relatedRecipeId int(11) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT recipesRecipes_recipeId_relatedRecipeId_key UNIQUE KEY (recipeId,relatedRecipeId),
	CONSTRAINT recipesRecipes_recipeId_fkey_copy FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT recipesRecipes_relatedRecipeId_fkey_copy FOREIGN KEY (relatedRecipeId) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Кросстаблица связей одних рецептов с другими.';
CREATE INDEX recipesRecipes_recipeId_idx USING BTREE ON recipesRecipes (recipeId);
CREATE INDEX recipesRecipes_relatedRecipeIdidx USING BTREE ON recipesRecipes (relatedRecipeId);

CREATE TABLE staticPages(
	id int(11) auto_increment NOT NULL,
	title varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	pathname varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	description varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	content varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL NULL,
	updatedAt datetime(3) DEFAULT current_timestamp(3) NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT staticPages_description_key UNIQUE KEY (description),
	CONSTRAINT staticPages_title_key UNIQUE KEY (title)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Содержимое статических страниц.';

CREATE TABLE structures (
	id int(11) auto_increment NOT NULL,
	title varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT structures_title_key UNIQUE KEY (title)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='';

CREATE TABLE tags (
	id int(11) auto_increment NOT NULL,
	title varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	CONSTRAINT tags_title_key UNIQUE KEY (title)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='';

