DELIMITER //
CREATE TRIGGER on_update_article BEFORE UPDATE ON articles
	FOR EACH ROW
		BEGIN
			IF NEW.published = 1 AND OLD.published = 0 THEN
				-- Проставление времени публикации в момент публикации рецепта:
				SET NEW.publishedAt = NOW();
			END IF;

			-- Проставление времени обновления при изменении рецепта:
			SET NEW.updatedAt = NOW();
		END;
		//
DELIMITER ;

DELIMITER //
CREATE TRIGGER on_update_recipe BEFORE UPDATE ON recipes
	FOR EACH ROW
		BEGIN
			IF NEW.published = 1 AND OLD.published = 0 THEN
				-- Проставление времени публикации в момент публикации рецепта:
				SET NEW.publishedAt = NOW();
			END IF;

			-- Проставление времени обновления при изменении рецепта:
			SET NEW.updatedAt = NOW();
		END;
		//
DELIMITER ;

DELIMITER //
CREATE TRIGGER on_publish_comment BEFORE UPDATE ON comments
	FOR EACH ROW
		BEGIN
			IF NEW.published = 1 AND OLD.published = 0 THEN
				-- Проставление времени публикации в момент публикации комментария:
				SET NEW.publishedAt = NOW();
			END IF;

			-- Проставление времени обновления рецепта при публикации комментария:
			UPDATE recipes SET updatedAt = NOW() WHERE id = NEW.recipeId;
		END;
		//
DELIMITER ;

DELIMITER //
CREATE TRIGGER on_insert_recipe_article AFTER INSERT ON articlesRecipes
	FOR EACH ROW
		BEGIN
			-- Проставление времени обновления статьи при добавлении рецептов
			UPDATE articles SET updatedAt = NOW() WHERE id = NEW.articleId;

			-- Проставление времени обновления рецепта при добавлении статей
			UPDATE recipes SET updatedAt = NOW() WHERE id = NEW.recipeId;
		END;
		//
DELIMITER ;

DELIMITER //
CREATE TRIGGER on_delete_recipe_article AFTER DELETE ON articlesRecipes
	FOR EACH ROW
		BEGIN
			-- Проставление времени обновления статьи при удалении рецептов
			UPDATE articles SET updatedAt = NOW() WHERE id = OLD.articleId;

			-- Проставление времени обновления рецепта при удалении статей
			UPDATE recipes SET updatedAt = NOW() WHERE id = OLD.recipeId;
		END;
		//
DELIMITER ;

CREATE TRIGGER on_insert_related_article AFTER INSERT ON articlesArticles
	FOR EACH ROW
		-- Проставление времени обновления статьи при добавлении связанных статей
		UPDATE articles SET updatedAt = NOW() WHERE id = NEW.articleId OR id = NEW.relatedArticleId;

CREATE TRIGGER on_delete_related_article AFTER DELETE ON articlesArticles
	FOR EACH ROW
		-- Проставление времени обновления статьи при удалении связанных статей
		UPDATE articles SET updatedAt = NOW() WHERE id = OLD.articleId OR id = OLD.relatedArticleId;

CREATE TRIGGER on_insert_tag AFTER INSERT ON recipesTags
	FOR EACH ROW
		-- Проставление времени обновления рецепта при добавлении тегов
		UPDATE recipes SET updatedAt = NOW() WHERE id = NEW.recipeId;

CREATE TRIGGER on_delete_tag AFTER DELETE ON recipesTags
	FOR EACH ROW
		-- Проставление времени обновления рецепта при удалении тегов
		UPDATE recipes SET updatedAt = NOW() WHERE id = OLD.recipeId;

CREATE TRIGGER on_insert_related_recipe AFTER INSERT ON recipesRecipes
	FOR EACH ROW
		-- Проставление времени обновления рецепта при добавлении связанных рецептов
		UPDATE recipes SET updatedAt = NOW() WHERE id = NEW.recipeId OR id = NEW.relatedRecipeId;

CREATE TRIGGER on_delete_related_recipe AFTER DELETE ON recipesRecipes
	FOR EACH ROW
		-- Проставление времени обновления рецепта при удалении связанных рецептов
		UPDATE recipes SET updatedAt = NOW() WHERE id = OLD.recipeId OR id = OLD.relatedRecipeId;

CREATE TRIGGER on_update_static BEFORE UPDATE ON staticPages
	FOR EACH ROW
		-- Проставление времени обновления при изменении статической страницы:
		SET NEW.updatedAt = NOW();
