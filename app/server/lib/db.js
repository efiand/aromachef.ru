import mysql from 'mysql2/promise';
import { log } from '#common/lib/log.js';

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = process.env;

/** @type {mysql.Pool} */
const pool = mysql.createPool({
	connectionLimit: 5,
	database: DB_NAME,
	host: DB_HOST,
	idleTimeout: 120000, // 2 минуты
	maxIdle: 2,
	password: DB_PASSWORD,
	queueLimit: 0,
	user: DB_USER,
	waitForConnections: true,
});

export async function closeDbPool() {
	await pool.end(); // закрывает все соединения пула и даёт ему «умереть»
}

/** @type {(error: unknown) => string} */
export function getDbError(error) {
	const { sqlMessage = '' } = /** @type {{ sqlMessage?: string }} */ (error || {});
	return sqlMessage;
}

/** @type {(query: string, payload: DbPlaceholder) => DbPlaceholder[]} */
function getPlaceholders(query, payload) {
	if (Array.isArray(payload)) {
		return payload;
	}

	const { length } = query.match(/\?/g) || [];
	return Array.from({ length }, () => payload);
}

/** @type {(error: unknown, context: { query?: string, payload?: unknown }) => void} */
function logDbError(error, context = {}) {
	const err = /** @type {any} */ (error || {});
	log.error('❌ [DB ERROR]', {
		code: err.code,
		errno: err.errno,
		message: err.message,
		sql: err.sql,
		sqlMessage: err.sqlMessage,
		sqlState: err.sqlState,
		...context,
	});
}

/** @type {(query: string, payload?: DbPlaceholder) => Promise<any>} */
export async function processDb(query, payload = []) {
	try {
		const [rows] = await pool.execute(query, getPlaceholders(query, payload));
		return rows;
	} catch (error) {
		logDbError(error, { payload, query });
		throw error; // пробрасываем выше, чтобы роутер вернул 500 и не «глотал» ошибку
	}
}
