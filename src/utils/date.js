import moment from 'moment-timezone';

export function convertUtcToTimezone(
  date,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'h:mm:ss a',
  timeZone = 'GMT',
) {
  const utcMoment = moment.utc(date, moment.ISO_8601);
  const timeZoneDate = utcMoment.tz(timeZone);

  return timeZoneDate.format(`${dateFormat} ${timeFormat}`);
}

export default {convertUtcToTimezone};
