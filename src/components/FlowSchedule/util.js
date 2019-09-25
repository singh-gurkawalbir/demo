import { uniq } from 'lodash';
import moment from 'moment';
import dateTimezones from '../../utils/dateTimezones';

const MINUTES = 1;
const HOURS = 2;
const DATE = 3;
const WEEKDAY = 5;
const PRESET_TAB = '0';
const ADVANCED_TAB = '1';
const MONTH = 4;
const HOURS_LIST = Array.from(Array(24).keys());
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

  return uniq(values).join(',');
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

export const getMetadata = ({ flow, integration, preferences }) => {
  const startTimeData = HOURS_LIST.map(
    hour =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(flow.scheduleStartMinute || 0, 'm')
        .format('LT'),
    Number
  );
  const startTimeOptions = [];
  const endTimeOptions = [];

  startTimeData.forEach(opt => {
    startTimeOptions.push({ label: opt, value: opt });
  });

  if (flow && flow.endTimeOptions) {
    flow.endTimeOptions.forEach(opt => {
      endTimeOptions.push({ label: opt, value: opt });
    });
  }

  return {
    fieldMap: {
      timeZone: {
        id: 'timeZone',
        name: 'timeZone',
        type: 'select',
        label: 'Time Zone',
        defaultValue:
          (flow && flow.timeZone) ||
          (integration && integration.timeZone) ||
          (preferences && preferences.timezone),
        options: [
          {
            items:
              (dateTimezones &&
                dateTimezones.map(date => ({
                  label: date.value,
                  value: date.name,
                }))) ||
              [],
          },
        ],
      },
      activeTab: {
        id: 'activeTab',
        name: 'activeTab',
        type: 'radiogroup',
        label: '',
        showOptionsHorizontally: true,
        fullWidth: true,
        defaultValue: flow.activeTab,
        options: [
          {
            items: [
              { label: 'Use Preset', value: PRESET_TAB },
              { label: 'Use Cron Expression', value: ADVANCED_TAB },
            ],
          },
        ],
      },
      frequency: {
        id: 'frequency',
        name: 'frequency',
        type: 'select',
        label: 'Frequency:',
        defaultValue: flow.frequency,
        options: [
          {
            items: [
              { label: 'Once Weekly', value: 'once_weekly' },
              { label: 'Once Daily', value: 'once_daily' },
              { label: 'Twice Daily', value: 'twice_daily' },
              { label: 'Every Eight Hours', value: 'every_eight_hours' },
              { label: 'Every Six Hours', value: 'every_six_hours' },
              { label: 'Every Four Hours', value: 'every_four_hours' },
              { label: 'Every Two Hours', value: 'every_two_hours' },
              { label: 'Every Hour', value: 'every_hour' },
              { label: 'Every 30 Minutes', value: 'every_half_hour' },
              { label: 'Every 15 Minutes', value: 'every_quarter' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
        ],
      },
      startTime: {
        id: 'startTime',
        name: 'startTime',
        type: 'select',
        label: 'Start Time:',
        defaultValue: flow && flow.startTime,
        options: [
          {
            items: startTimeOptions,
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: [''],
          },
        ],
        description:
          'Please note that start time represents when your flow will get placed in the queue for processing. The actual run time for your flow may vary based on the current message load in your queue, or other flows that are ahead of your flow in the global integrator.io scheduler. Please note also that the list of available start times is subject to change over time to help maintain balance regarding the total number of flows that are starting at any specific time.',
      },
      endTime: {
        id: 'endTime',
        name: 'endTime',
        type: 'select',
        label: 'End Time:',
        defaultValue: flow && flow.endTime,
        options: [
          {
            items: endTimeOptions,
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: ['once_weekly', 'once_daily', ''],
          },
        ],
      },
      daysToRunOn: {
        id: 'daysToRunOn',
        name: 'daysToRunOn',
        type: 'multiselect',
        label: 'Days To Run On:',
        defaultValue: flow.daysToRunOn || ['1', '2', '3', '4', '5', '6', '0'],
        options: [
          {
            items: [
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
              { value: '6', label: 'Saturday' },
              { value: '0', label: 'Sunday' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: ['once_weekly', ''],
          },
        ],
      },
      dayToRunOn: {
        id: 'dayToRunOn',
        name: 'dayToRunOn',
        type: 'select',
        label: 'Day To Run On:',
        defaultValue: flow.dayToRunOn,
        options: [
          {
            items: [
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
              { value: '6', label: 'Saturday' },
              { value: '0', label: 'Sunday' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            is: ['once_weekly'],
          },
        ],
      },
      schedule: {
        id: 'schedule',
        name: 'schedule',
        type: 'text',
        label: 'Schedule:',
        defaultValue: flow.schedule,
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [ADVANCED_TAB],
          },
        ],
      },
    },
    layout: {
      fields: [
        'timeZone',
        'activeTab',
        'frequency',
        'startTime',
        'endTime',
        'daysToRunOn',
        'dayToRunOn',
        'schedule',
      ],
    },
  };
};

export const setValues = data => {
  const flow = { ...data };
  const value = flow.schedule;
  const frequency = {
    '1': 'every_hour',
    '2': 'every_two_hours',
    '4': 'every_four_hours',
    '6': 'every_six_hours',
    '8': 'every_eight_hours',
    '12': 'twice_daily',
  };
  let hours;

  flow.frequency = undefined;
  flow.startTime = undefined;
  flow.endTime = undefined;
  flow.endTimeOptions = HOURS_LIST.map(
    hour =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(flow.scheduleStartMinute, 'm')
        .format('LT'),
    Number
  );
  flow.daysToRunOn = ['1', '2', '3', '4', '5', '6', '0'];
  flow.dayToRunOn = undefined;

  if (!value) {
    flow.activeTab = PRESET_TAB;

    return flow;
  }

  flow.activeTab = ADVANCED_TAB;
  const cronArr = value.split(' ');

  if (cronArr.length !== 6 || cronArr[DATE] !== '?' || cronArr[MONTH] !== '*') {
    return flow;
  }

  if (
    cronArr.join(' ') === '? */15 * ? * *' ||
    cronArr.join(' ') === '? 10-59/15 * ? * *'
  ) {
    flow.activeTab = PRESET_TAB;
    flow.frequency = 'every_quarter';
    flow.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return flow;
  }

  if (
    cronArr.join(' ') === '? */30 * ? * *' ||
    cronArr.join(' ') === '? 10-59/30 * ? * *'
  ) {
    flow.activeTab = PRESET_TAB;
    flow.frequency = 'every_half_hour';
    flow.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return flow;
  }

  if (/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/.test(cronArr.join(' '))) {
    flow.activeTab = PRESET_TAB;
    flow.frequency =
      frequency[value.match(/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/)[1]];
    flow.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return flow;
  }

  if (
    cronArr[MINUTES] === '0,30' ||
    cronArr[MINUTES] === '10,40' ||
    cronArr[MINUTES] === '0,15,30,45' ||
    cronArr[MINUTES] === '10,25,40,55'
  ) {
    flow.activeTab = PRESET_TAB;
    flow.frequency =
      cronArr[MINUTES] === '0,30' || cronArr[MINUTES] === '10,40'
        ? 'every_half_hour'
        : 'every_quarter';

    if (cronArr[HOURS] !== '*' && cronArr[HOURS] !== '?') {
      hours = cronArr[HOURS].split(',');
      flow.startTime = moment()
        .startOf('day')
        .add(hours[0], 'h')
        .add(flow.scheduleStartMinute, 'm')
        .format('LT');

      if (hours.length) {
        const minutes = flow.frequency === 'every_quarter' ? 45 : 30;

        flow.endTimeOptions = HOURS_LIST.map(
          hour =>
            moment()
              .startOf('day')
              .add(hour, 'h')
              .add(minutes, 'm')
              .add(flow.scheduleStartMinute, 'm')
              .format('LT'),
          Number
        );
        flow.endTime = moment(flow.startTime, 'LT')
          .add(hours.length - 1, 'h')
          .add(minutes, 'm')
          .format('LT');
      }
    }

    flow.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return flow;
  }

  if (
    (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
    cronArr[HOURS].indexOf('*') === -1 &&
    cronArr[HOURS].indexOf('?') === -1
  ) {
    hours = cronArr[HOURS].split(',');
    let symDiff = true;

    if (hours.length > 1) {
      flow.activeTab = PRESET_TAB;
      const diff = hours[1] - hours[0];

      for (let i = 1; i < hours.length; i += 1) {
        if (hours[i] - hours[i - 1] !== diff) {
          symDiff = false;
        }
      }

      if (symDiff) {
        flow.frequency = frequency[diff.toString()];
        flow.startTime = moment()
          .startOf('day')
          .add(hours[0], 'h')
          .add(flow.scheduleStartMinute, 'm')
          .format('LT');
        flow.endTime = moment(flow.startTime, 'LT')
          .add(diff * (hours.length - 1), 'h')
          .format('LT');
      }

      flow.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return flow;
    }
  }

  if (
    (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
    cronArr[HOURS] &&
    cronArr[HOURS].split(',').length === 1
  ) {
    if (cronArr[WEEKDAY] !== '*' && cronArr[WEEKDAY].split(',').length === 1) {
      flow.activeTab = PRESET_TAB;
      flow.frequency = 'once_weekly';
      flow.startTime = moment()
        .startOf('day')
        .add(cronArr[HOURS], 'h')
        .add(flow.scheduleStartMinute, 'm')
        .format('LT');
      flow.endTime = undefined;
      flow.dayToRunOn = cronArr[WEEKDAY];
    } else {
      flow.activeTab = PRESET_TAB;
      flow.frequency = 'once_daily';
      flow.startTime = moment()
        .startOf('day')
        .add(cronArr[HOURS], 'h')
        .add(flow.scheduleStartMinute, 'm')
        .format('LT');
      flow.endTime = undefined;
      flow.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');
    }

    return flow;
  }

  return flow;
};

export default { getCronExpression, getMetadata, setValues };
