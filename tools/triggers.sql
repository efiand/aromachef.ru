DELIMITER //
CREATE TRIGGER on_update_recipe BEFORE UPDATE ON `recipes`
	FOR EACH ROW
		BEGIN
			IF NEW.`published` = 1 AND OLD.`published` = 0 THEN
				-- Проставление времени публикации в момент публикации:
				SET NEW.`publishedAt` = NOW();
			END IF;

			-- Проставление времени обновления при изменении рецепта:
			SET NEW.`updatedAt` = NOW();
		END;
		//
DELIMITER ;

CREATE TRIGGER on_insert_tag AFTER INSERT ON `recipesTags`
	FOR EACH ROW UPDATE `recipes`
		-- Проставление времени обновления рецепта при добавлении тегов
		SET `updatedAt` = NOW() WHERE `id` = NEW.`recipeId`;

CREATE TRIGGER on_delete_tag AFTER DELETE ON `recipesTags`
	FOR EACH ROW UPDATE `recipes`
		-- Проставление времени обновления рецепта при удалении тегов
		SET `updatedAt` = NOW() WHERE `id` = OLD.`recipeId`;

CREATE TRIGGER on_update_static BEFORE UPDATE ON `staticPages`
	FOR EACH ROW
		-- Проставление времени обновления при изменении статической страницы:
		SET NEW.`updatedAt` = NOW();
