import { BASE_URL } from "#!/constants.js";

const { DEV, PORT } = process.env;

export const isDev = Boolean(DEV);

export const port = Number(PORT) || 4101;
export const host = `http://localhost:${port}`;

export const picturesHost = isDev ? BASE_URL : "";
