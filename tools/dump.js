import { log } from "#common/lib/log.js";
import { closeDbPool } from "#server/lib/db.js";
import { dump } from "#server/lib/dump.js";

try {
	await dump();
	log.info("✅ Резервное копирование выполнено");
} finally {
	await closeDbPool();
}
