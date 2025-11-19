import mysql from "mysql2/promise";

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = process.env;

/** @type {mysql.Connection?} */
let dbConnection = null;

async function connect() {
	if (!dbConnection) {
		dbConnection = await mysql.createConnection({
			database: DB_NAME,
			host: DB_HOST,
			password: DB_PASSWORD,
			user: DB_USER,
		});
	}
	return dbConnection;
}

/** @type {(error: unknown) => string} */
export function getDbError(error) {
	const { sqlMessage = "" } = /** @type {{ sqlMessage?: string }} */ (error || {});
	return sqlMessage;
}

/** @type {(query: string, payload: unknown) => unknown[]} */
function getPlaceholders(query, payload) {
	if (Array.isArray(payload)) {
		return payload;
	}

	const { length } = query.match(/\?/g) || [];
	return Array.from({ length }, () => payload);
}

/** @type {(query: string, payload?: unknown) => Promise<any>} */
export async function processDb(query, payload = []) {
	const connection = await connect();

	const [rows] = await connection.execute(query, getPlaceholders(query, payload));
	return rows;
}
