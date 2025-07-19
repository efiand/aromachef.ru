import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/** Скорректировать время в меньшую сторону на число часовых поясов */
function correctZone(date: dayjs.ConfigType, value = 3) {
	const result = dayjs(date).subtract(value, 'h');

	if (date instanceof Date) {
		return result.toDate();
	}

	return result;
}

/** Число дней в месяце для указанной даты */
function daysInMonth(date: dayjs.ConfigType = Date.now()) {
	return dayjs(date).daysInMonth();
}

function getPaddedZone(zone: number) {
	return `${zone}`.padStart(2, '0');
}

/** Продолжтельность в днях */
function toDays(timestamp: number) {
	return dayjs.duration(timestamp).asDays();
}

/** Время в формате RFC-822 (Tue, 21 Apr 2015 14:15:00 +0300) */
function toRFC822(dateString: dayjs.ConfigType, zone = 3) {
	return dayjs(dateString).format(
		`ddd, DD MMM YYYY HH:mm:ss +${getPaddedZone(zone)}00`
	);
}

/** Время в формате W3C Datetime (1997-07-16T19:20:30+03:00) */
function toW3CDatetime(dateString: dayjs.ConfigType, zone = 3) {
	return dayjs(dateString).format(
		`YYYY-MM-DDTHH:mm:ss+${getPaddedZone(zone)}:00`
	);
}

export { correctZone, dayjs, daysInMonth, toDays, toRFC822, toW3CDatetime };
