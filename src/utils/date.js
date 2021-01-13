import moment from 'moment-timezone';

export function convertUtcToTimezone(
  date,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'h:mm:ss a',
  timeZone,
  dateOnly
) {
  const utcMoment = moment.utc(date, moment.ISO_8601);

  const timeZoneDate = utcMoment.tz(timeZone || moment.tz.guess(true)); // timeZone could be null.

  return dateOnly ? timeZoneDate.format(`${dateFormat}`) : timeZoneDate.format(`${dateFormat} ${timeFormat}`);
}

export default {convertUtcToTimezone};
