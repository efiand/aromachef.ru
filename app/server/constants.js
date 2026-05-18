export const { APP_ROOT, DEV, PORT, PROJECT_ROOT = process.cwd() } = process.env;

export const isDev = Boolean(DEV);

export const port = Number(PORT) || 4101;
export const host = `http://localhost:${port}`;
export const cwd = APP_ROOT || PROJECT_ROOT;
