import { after } from 'node:test';
import { closeDbPool } from '#server/lib/db.js';

/** Закрывает пул MySQL после spec-файла, чтобы процесс теста завершался. */
export function useDbTeardown() {
	after(async () => {
		await closeDbPool();
	});
}
