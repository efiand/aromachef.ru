import mysql from "mysql2/promise";

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = process.env;

/** @type {typeof globalThis & { dbConnection?: mysql.Connection }} */
const customGlobal = global;

async function connect() {
	if (!customGlobal.dbConnection) {
		customGlobal.dbConnection = await mysql.createConnection({
			database: DB_NAME,
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASSWORD,
		});
	}
	return customGlobal.dbConnection;
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
