import { closeDbPool } from "#server/lib/db.js";
import { dump } from "#server/lib/dump.js";

try {
	await dump();
	console.info("✅ Резервное копирование выполнено");
} finally {
	await closeDbPool();
}
