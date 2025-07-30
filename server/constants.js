import { BASE_URL } from "#!/constants.js";

const { DEV, PORT } = process.env;

export const port = Number(PORT);

export const isDev = Boolean(DEV);

export const picturesHost = isDev ? BASE_URL : "";
