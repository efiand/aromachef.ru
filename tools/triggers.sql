CREATE TRIGGER on_insert_recipe BEFORE INSERT ON `recipes`
	FOR EACH ROW SET NEW.`updatedAt` = NOW();

CREATE TRIGGER on_update_recipe BEFORE UPDATE ON `recipes`
	FOR EACH ROW SET NEW.`updatedAt` = NOW();

CREATE TRIGGER on_insert_tag AFTER INSERT ON `recipesTags`
	FOR EACH ROW UPDATE `recipes` SET `updatedAt` = NOW() WHERE `id` = NEW.`recipeId`;

CREATE TRIGGER on_delete_tag AFTER DELETE ON `recipesTags`
	FOR EACH ROW UPDATE `recipes` SET `updatedAt` = NOW() WHERE `id` = OLD.`recipeId`;
