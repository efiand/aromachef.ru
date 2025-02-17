import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/** Число дней в месяце для указанной даты */
function daysInMonth(date: dayjs.ConfigType = Date.now()) {
	return dayjs(date).daysInMonth();
}

/** Продолжтельность в днях */
function toDays(timestamp: number) {
	return dayjs.duration(timestamp).asDays();
}

/** Время в формате RFC-822 (Tue, 21 Apr 2015 14:15:00 +0300) */
function toRFC822(dateString: dayjs.ConfigType) {
	return dayjs(dateString).format('ddd, DD MMM YYYY hh:mm:ss +0300');
}

/** Время в формате W3C Datetime (1997-07-16T19:20:30+03:00) */
function toW3CDatetime(dateString: dayjs.ConfigType) {
	return dayjs(dateString).format('YYYY-MM-DDThh:mm:ss+03:00');
}

export { daysInMonth, toDays, toRFC822, toW3CDatetime };
