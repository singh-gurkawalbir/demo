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

export const getExportsFromSelectedDeltaFlow = (
  selectedDeltaFlowId,
  flows,
  exports
) => {
  const temp = [];

  if (selectedDeltaFlowId) {
    const selectedDeltaFlow = flows.find(
      flow => flow._id === selectedDeltaFlowId
    );

    selectedDeltaFlow &&
      selectedDeltaFlow.pageGenerators.forEach(pg => {
        temp.push(exports.find(exp => exp._id === pg._exportId));
      });
  }

  return [
    {
      items:
        (temp &&
          temp.map(exp => ({
            label: exp.name,
            value: exp._id,
          }))) ||
        [],
    },
  ];
};

export const getAllDeltaFlows = (flows, flow, exports) => {
  const deltaFlows = flows.filter(f => {
    let isDeltaFlow = false;

    if (f._id === flow._id) {
      return false;
    }

    if (f.pageGenerators) {
      f.pageGenerators.forEach(pg => {
        const exp = exports && exports.find(e => e._id === pg._exportId);

        if (exp && exp.type === 'delta') {
          isDeltaFlow = true;
        }
      });
    } else if (f && f._exportId) {
      const exp = exports && exports.find(e => e._id === f._exportId);

      if (exp && exp.type === 'delta') {
        isDeltaFlow = true;
      }
    }

    return isDeltaFlow;
  });

  return [
    {
      items:
        (deltaFlows &&
          deltaFlows.map(f => ({
            label: f.name,
            value: f._id,
          }))) ||
        [],
    },
  ];
};

export const isDeltaFlowModel = (integration, pg, exp, flow, exports) => {
  let isDeltaFlow = false;

  if (pg && pg._exportId) {
    if (exp && exp.type === 'delta' && !(exp.delta && exp.delta.lagOffset)) {
      isDeltaFlow = true;
    }
  } else {
    flow &&
      flow.pageGenerators &&
      flow.pageGenerators.forEach(pg => {
        const flowExp = exports && exports.find(e => e._id === pg._exportId);

        if (
          flowExp &&
          flowExp.type === 'delta' &&
          !(flowExp.delta && flowExp.delta.lagOffset)
        ) {
          isDeltaFlow = true;
        }
      });
  }

  return isDeltaFlow;
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

export const getMetadata = ({
  resource,
  integration,
  preferences,
  flow,
  schedule,
  exp,
  exports,
  pg,
  flows,
}) => {
  const startTimeData = HOURS_LIST.map(
    hour =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(resource.scheduleStartMinute || 0, 'm')
        .format('LT'),
    Number
  );
  const startTimeOptions = [];
  const endTimeOptions = [];

  startTimeData.forEach(opt => {
    startTimeOptions.push({ label: opt, value: opt });
  });

  if (resource && resource.endTimeOptions) {
    resource.endTimeOptions.forEach(opt => {
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
        fullWidth: true,
        defaultValue: resource.activeTab,
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
        label: 'Frequency',
        defaultValue: resource.frequency,
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
        label: 'Start Time',
        defaultValue: resource && resource.startTime,
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
        label: 'End Time',
        defaultValue: resource && resource.endTime,
        options: [
          {
            items: endTimeOptions,
          },
        ],
        refreshOptionsOnChangesTo: ['frequency'],
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
        label: 'Days To Run On',
        defaultValue: resource.daysToRunOn || [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '0',
        ],
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
        label: 'Day To Run On',
        defaultValue: resource.dayToRunOn,
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
        label: 'Schedule',
        defaultValue: schedule,
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [ADVANCED_TAB],
          },
        ],
      },
      _keepDeltaBehindFlowId: {
        id: '_keepDeltaBehindFlowId',
        name: '_keepDeltaBehindFlowId',
        type: 'select',
        visible: isDeltaFlowModel(integration, pg, exp, flow, exports),
        label: 'Master flow:',
        defaultValue: resource && resource._keepDeltaBehindFlowId,
        options: getAllDeltaFlows(flows, flow, exports),
      },
      _keepDeltaBehindExportId: {
        id: '_keepDeltaBehindExportId',
        name: '_keepDeltaBehindExportId',
        label: 'Delta export:',
        type: 'select',
        options: getExportsFromSelectedDeltaFlow(
          resource && resource._keepDeltaBehindFlowId,
          flows,
          exports
        ),
        visible: !!(
          isDeltaFlowModel(integration, pg, exp, flow, exports) &&
          pg &&
          pg._exportId
        ),
        refreshOptionsOnChangesTo: ['_keepDeltaBehindFlowId'],
        defaultValue: resource && resource._keepDeltaBehindExportId,
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
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'Synchronize delta export',
          fields: ['_keepDeltaBehindFlowId', '_keepDeltaBehindExportId'],
        },
      ],
    },
    optionsHandler: (fieldId, fields) => {
      if (fieldId === '_keepDeltaBehindExportId') {
        const keepDeltaBehindFlowId = fields.find(
          field => field.id === '_keepDeltaBehindFlowId'
        );

        return getExportsFromSelectedDeltaFlow(
          keepDeltaBehindFlowId && keepDeltaBehindFlowId.value,
          flows,
          exports
        );
      } else if (fieldId === 'endTime') {
        const frequency = fields.find(field => field.id === 'frequency').value;
        let minutes = 0;

        if (frequency === 'every_half_hour') {
          minutes = 30;
        } else if (frequency === 'every_quarter') {
          minutes = 45;
        }

        const options = HOURS_LIST.map(
          hour =>
            moment()
              .startOf('day')
              .add(hour, 'h')
              .add(minutes, 'm')
              .format('LT'),
          Number
        );

        return [
          {
            items:
              (options &&
                options.map(opt => ({
                  label: opt,
                  value: opt,
                }))) ||
              [],
          },
        ];
      }

      return null;
    },
  };
};

export const setValues = (data, schedule) => {
  const resource = { ...data };
  const value = schedule;
  const frequency = {
    '1': 'every_hour',
    '2': 'every_two_hours',
    '4': 'every_four_hours',
    '6': 'every_six_hours',
    '8': 'every_eight_hours',
    '12': 'twice_daily',
  };
  let hours;

  resource.frequency = undefined;
  resource.startTime = undefined;
  resource.endTime = undefined;
  resource.endTimeOptions = HOURS_LIST.map(
    hour =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(resource.scheduleStartMinute, 'm')
        .format('LT'),
    Number
  );
  resource.daysToRunOn = ['1', '2', '3', '4', '5', '6', '0'];
  resource.dayToRunOn = undefined;

  if (!value) {
    resource.activeTab = PRESET_TAB;

    return resource;
  }

  resource.activeTab = ADVANCED_TAB;
  const cronArr = value.split(' ');

  if (cronArr.length !== 6 || cronArr[DATE] !== '?' || cronArr[MONTH] !== '*') {
    return resource;
  }

  if (
    cronArr.join(' ') === '? */15 * ? * *' ||
    cronArr.join(' ') === '? 10-59/15 * ? * *'
  ) {
    resource.activeTab = PRESET_TAB;
    resource.frequency = 'every_quarter';
    resource.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return resource;
  }

  if (
    cronArr.join(' ') === '? */30 * ? * *' ||
    cronArr.join(' ') === '? 10-59/30 * ? * *'
  ) {
    resource.activeTab = PRESET_TAB;
    resource.frequency = 'every_half_hour';
    resource.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return resource;
  }

  if (/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/.test(cronArr.join(' '))) {
    resource.activeTab = PRESET_TAB;
    resource.frequency =
      frequency[value.match(/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/)[1]];
    resource.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return resource;
  }

  if (
    cronArr[MINUTES] === '0,30' ||
    cronArr[MINUTES] === '10,40' ||
    cronArr[MINUTES] === '0,15,30,45' ||
    cronArr[MINUTES] === '10,25,40,55'
  ) {
    resource.activeTab = PRESET_TAB;
    resource.frequency =
      cronArr[MINUTES] === '0,30' || cronArr[MINUTES] === '10,40'
        ? 'every_half_hour'
        : 'every_quarter';

    if (cronArr[HOURS] !== '*' && cronArr[HOURS] !== '?') {
      hours = cronArr[HOURS].split(',');
      resource.startTime = moment()
        .startOf('day')
        .add(hours[0], 'h')
        .add(resource.scheduleStartMinute, 'm')
        .format('LT');

      if (hours.length) {
        const minutes = resource.frequency === 'every_quarter' ? 45 : 30;

        resource.endTimeOptions = HOURS_LIST.map(
          hour =>
            moment()
              .startOf('day')
              .add(hour, 'h')
              .add(minutes, 'm')
              .add(resource.scheduleStartMinute, 'm')
              .format('LT'),
          Number
        );
        resource.endTime = moment(resource.startTime, 'LT')
          .add(hours.length - 1, 'h')
          .add(minutes, 'm')
          .format('LT');
      }
    }

    resource.daysToRunOn =
      cronArr[WEEKDAY] === '*'
        ? ['1', '2', '3', '4', '5', '6', '0']
        : cronArr[WEEKDAY].split(',');

    return resource;
  }

  if (
    (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
    cronArr[HOURS].indexOf('*') === -1 &&
    cronArr[HOURS].indexOf('?') === -1
  ) {
    hours = cronArr[HOURS].split(',');
    let symDiff = true;

    if (hours.length > 1) {
      resource.activeTab = PRESET_TAB;
      const diff = hours[1] - hours[0];

      for (let i = 1; i < hours.length; i += 1) {
        if (hours[i] - hours[i - 1] !== diff) {
          symDiff = false;
        }
      }

      if (symDiff) {
        resource.frequency = frequency[diff.toString()];
        resource.startTime = moment()
          .startOf('day')
          .add(hours[0], 'h')
          .add(resource.scheduleStartMinute, 'm')
          .format('LT');
        resource.endTime = moment(resource.startTime, 'LT')
          .add(diff * (hours.length - 1), 'h')
          .format('LT');
      }

      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return resource;
    }
  }

  if (
    (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
    cronArr[HOURS] &&
    cronArr[HOURS].split(',').length === 1
  ) {
    if (cronArr[WEEKDAY] !== '*' && cronArr[WEEKDAY].split(',').length === 1) {
      resource.activeTab = PRESET_TAB;
      resource.frequency = 'once_weekly';
      resource.startTime = moment()
        .startOf('day')
        .add(cronArr[HOURS], 'h')
        .add(resource.scheduleStartMinute, 'm')
        .format('LT');
      resource.endTime = undefined;
      resource.dayToRunOn = cronArr[WEEKDAY];
    } else {
      resource.activeTab = PRESET_TAB;
      resource.frequency = 'once_daily';
      resource.startTime = moment()
        .startOf('day')
        .add(cronArr[HOURS], 'h')
        .add(resource.scheduleStartMinute, 'm')
        .format('LT');
      resource.endTime = undefined;
      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');
    }

    return resource;
  }

  return resource;
};

export const getScheduleStartMinute = (resource, preferences) => {
  let scheduleStartMinute = 0;

  if (preferences && preferences.scheduleShiftForFlowsCreatedAfter) {
    const changeStartMinuteForFlowsCreatedAfter = moment(
      preferences.scheduleShiftForFlowsCreatedAfter
    );

    if (
      !resource.createdAt ||
      changeStartMinuteForFlowsCreatedAfter.diff(moment(resource.createdAt)) < 0
    ) {
      scheduleStartMinute = 10;
    }
  }

  return scheduleStartMinute;
};

export const getScheduleVal = (formVal, scheduleStartMinute) => {
  let scheduleValue;

  if (formVal.activeTab === ADVANCED_TAB) {
    // Need to handle Cron Editor Changes
    scheduleValue = formVal.schedule;
  } else {
    if (
      formVal.startTime &&
      formVal.endTime &&
      !moment(formVal.startTime, 'LT').isBefore(moment(formVal.endTime, 'LT'))
    ) {
      // alert('End Time is invalid');
      return false;
    }

    scheduleValue =
      getCronExpression(formVal, scheduleStartMinute) === '? * * * * *'
        ? ''
        : getCronExpression(formVal, scheduleStartMinute);
  }

  return scheduleValue;
};

export default { getCronExpression, getMetadata, setValues };
