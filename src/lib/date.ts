import dayjs from 'dayjs';

/** Время в формате RFC-822 (Tue, 21 Apr 2015 14:15:00 +0300) */
function toRFC822(dateString: dayjs.ConfigType) {
	return dayjs(dateString).format('ddd, DD MMM YYYY hh:mm:ss +0300');
}

export { toRFC822 };
