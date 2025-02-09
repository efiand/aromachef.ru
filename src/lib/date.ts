import dayjs from 'dayjs';

/** Время в формате RFC-822 (Tue, 21 Apr 2015 14:15:00 +0300) */
function toRFC822(dateString: dayjs.ConfigType) {
	return dayjs(dateString).format('ddd, DD MMM YYYY hh:mm:ss +0300');
}

/** Время в формате W3C Datetime (1997-07-16T19:20:30+03:00) */
function toW3CDatetime(dateString: dayjs.ConfigType) {
	return dayjs(dateString).format('YYYY-MM-DDThh:mm:ss+03:00');
}

export { toRFC822, toW3CDatetime };
