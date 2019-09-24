import _ from 'lodash';
import moment from 'moment';

const MINUTES = 1;
const HOURS = 2;
const DATE = 3;
const WEEKDAY = 5;
const getHoursValue = startTime => moment(startTime, 'LT').hours();
const getHours = (startTime, endTime, frequency) => {
  const values = [];
  let sTime = moment(startTime, 'LT');
  const eTime = moment(endTime, 'LT');

  values.push(getHoursValue(sTime.format('LT')));

  while (sTime.isBefore(eTime) || sTime.isSame(eTime)) {
    values.push(getHoursValue(sTime.format('LT')));
    sTime = sTime.add(frequency, 'm');
  }

  return _.uniq(values).join(',');
};

export const getCronExpression = (data, scheduleStartMinute) => {
  const frequency = data && data.frequency;
  const toReturn = ['?', '*', '*', '*', '*', '*'];

  switch (frequency) {
    case 'once_weekly':
      toReturn[MINUTES] = '0';
      toReturn[HOURS] = data.startTime ? getHoursValue(data.startTime) : '0';
      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.dayToRunOn ? data.dayToRunOn.toString() : '1';
      break;
    case 'once_daily':
      toReturn[MINUTES] = '0';
      toReturn[HOURS] = data.startTime ? getHoursValue(data.startTime) : '0';
      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'twice_daily':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/12';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          12 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_eight_hours':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/8';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          8 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_six_hours':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/6';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          6 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_four_hours':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/4';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          4 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_two_hours':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/2';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          2 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_hour':
      toReturn[MINUTES] = '0';

      if (!data.startTime && !data.endTime) {
        toReturn[HOURS] = '*/1';
      } else {
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          1 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_half_hour':
      if (!data.startTime && !data.endTime) {
        toReturn[MINUTES] = '*/30';
      } else {
        toReturn[MINUTES] = '0,30';
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          0.5 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    case 'every_quarter':
      if (!data.startTime && !data.endTime) {
        toReturn[MINUTES] = '*/15';
      } else {
        toReturn[MINUTES] = '0,15,30,45';
        toReturn[HOURS] = getHours(
          data.startTime
            ? data.startTime
            : moment()
                .startOf('day')
                .format('LT'),
          data.endTime
            ? data.endTime
            : moment()
                .endOf('day')
                .format('LT'),
          0.25 * 60
        );
      }

      toReturn[DATE] = '?';
      toReturn[WEEKDAY] = data.daysToRunOn ? data.daysToRunOn.toString() : '*';
      break;
    default:
      break;
  }

  if (toReturn[WEEKDAY] === '1,2,3,4,5,6,0' || toReturn[WEEKDAY] === '') {
    toReturn[WEEKDAY] = '*';
  }

  if (toReturn[MINUTES] && scheduleStartMinute > 0) {
    switch (toReturn[MINUTES]) {
      case '0':
        toReturn[MINUTES] = scheduleStartMinute.toString();
        break;
      case '*/30':
        toReturn[MINUTES] = `${scheduleStartMinute.toString()}-59/30`;
        break;
      case '0,30':
        toReturn[MINUTES] = [
          scheduleStartMinute,
          30 + scheduleStartMinute,
        ].join(',');
        break;
      case '*/15':
        toReturn[MINUTES] = `${scheduleStartMinute.toString()}-59/15`;
        break;
      case '0,15,30,45':
        toReturn[MINUTES] = [
          scheduleStartMinute,
          15 + scheduleStartMinute,
          30 + scheduleStartMinute,
          45 + scheduleStartMinute,
        ].join(',');
        break;
      default:
        break;
    }
  }

  return toReturn.join(' ');
};

export default { getCronExpression };
