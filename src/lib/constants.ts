import { dev } from '$app/environment';

const BASE_DOMAIN = 'aromachef.ru';
const BASE_AMP_DOMAIN = `amp.${BASE_DOMAIN}`;

const BASE_URL = `https://${BASE_DOMAIN}`;
const BASE_AMP_URL = `https://${BASE_AMP_DOMAIN}`;
const PICTURE_URL = `${BASE_URL}/pictures`;

const TG_URL = 'https://t.me/aroma_chef';

const PROJECT_NAME = 'АромаШеф';

const BEGIN_DATE = new Date('2025-01-11');

const PUBLISHED_QUERY = dev ? {} : { published: true };

export {
	BASE_AMP_DOMAIN,
	BASE_AMP_URL,
	BASE_DOMAIN,
	BASE_URL,
	BEGIN_DATE,
	PICTURE_URL,
	PROJECT_NAME,
	PUBLISHED_QUERY,
	TG_URL
};
