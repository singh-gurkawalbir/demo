import moment from 'moment-timezone';

export function convertUtcToTimezone(
  date,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'h:mm:ss a',
  timeZone,
  dateOpts,
) {
  const utcMoment = moment.utc(date, moment.ISO_8601);

  const timeZoneDate = utcMoment.tz(timeZone || moment.tz.guess(true)); // timeZone could be null.

  if (dateOpts?.skipFormatting) {
    return timeZoneDate;
  }

  return dateOpts?.dateOnly ? timeZoneDate.format(`${dateFormat}`) : timeZoneDate.format(`${dateFormat} ${timeFormat}`);
}

export function getNDaysBeforeDate(days) {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - days));

  return yesterday;
}

export default {convertUtcToTimezone};
