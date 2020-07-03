import moment from 'moment';

const HOURS_LIST = Array.from(Array(24).keys());
export const FREQUENCY = {
  MANUAL: { value: 'MANUAL', label: 'Manual (only when I click "Run Now")' },
  ONCE_WEEKLY: { value: '168-HOURS', label: 'Once weekly' },
  ONCE_DAILY: { value: '24-HOURS', label: 'Once daily' },
  TWICE_DAILY: { value: '12-HOURS', label: 'Twice daily' },
  EVERY_8_HOURS: { value: '8-HOURS', label: 'Every eight hours' },
  EVERY_6_HOURS: { value: '6-HOURS', label: 'Every six hours' },
  EVERY_4_HOURS: { value: '4-HOURS', label: 'Every four hours' },
  EVERY_2_HOURS: { value: '2-HOURS', label: 'Every two hours' },
  EVERY_1_HOUR: { value: '1-HOUR', label: 'Every hour' },
  EVERY_30_MINUTES: {
    value: '1-HALFHOUR',
    label: 'Every 30 minutes',
  },
  EVERY_15_MINUTES: {
    value: '1-QUARTER',
    label: 'Every 15 minutes',
  },
};
export const WEEK_DAYS = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

export const getHoursExpression = (scheduleDetails) => {
  const period =
    scheduleDetails.frequency.substring(
      0,
      scheduleDetails.frequency.indexOf('-')
    ) * 1;
  let endHour = scheduleDetails.endTime
    ? moment(scheduleDetails.endTime, 'h:mm A').get('hour')
    : 23;
  const startHour = scheduleDetails.startTime
    ? moment(scheduleDetails.startTime, 'h:mm A').get('hour')
    : 0;
  let i = 1;
  const maxOccurrances = 24 / period;
  let jobTime = period;
  let hoursExp = [startHour.toString()];
  const hoursExp2 = [];
  if (parseInt(endHour, 10) < parseInt(startHour, 10)) {
    endHour += 24;
  }

  for (i = 1; i < maxOccurrances; i += 1) {
    if (startHour + jobTime > endHour) {
      break;
    }
    if (startHour + jobTime >= 24) {
      hoursExp2.push((startHour + jobTime - 24).toString());
    } else {
      hoursExp.push((startHour + jobTime).toString());
    }
    jobTime += period;
  }
  hoursExp = hoursExp2.concat(hoursExp);
  return hoursExp.join(',');
};

export const getCronExpression = (scheduleDetails) => {
  const { frequency, startTime } = scheduleDetails;
  if (['', FREQUENCY.MANUAL.value].includes(frequency)) {
    return '';
  }
  const hour = getHoursExpression(scheduleDetails);
  let min;
  let startMin;
  const minutesInterval = 15;
  const days = [];
  if (frequency === FREQUENCY.EVERY_15_MINUTES.value) {
    min = '*';
  } else if (frequency === FREQUENCY.EVERY_30_MINUTES.value) {
    startMin = moment(startTime, 'h:mm A').get('minute');
    min = [startMin, startMin + (minutesInterval - 1)].join('-');
    if (startMin >= 30) {
      startMin -= 30;
    }
    min = [
      [startMin, startMin + minutesInterval - 1].join('-'),
      [startMin + 30, startMin + 30 + minutesInterval - 1].join('-'),
    ].join(',');
  } else {
    startMin = moment(startTime, 'h:mm A').get('minute');
    min = [startMin, startMin + minutesInterval - 1].join('-');
  }
  Object.keys(WEEK_DAYS).forEach((d) => {
    if (scheduleDetails[d.toLowerCase()] === d) {
      days.push(d.substr(0, 3));
    }
  });
  return [min, hour, '?', '*', days.join(',')].join(' ');
};

const getEndTimeOptions = (frequency, scheduleStartMinute) => {
  let minutes = 0;
  if (frequency === FREQUENCY.EVERY_30_MINUTES.value) {
    minutes = 30;
  } else if (frequency === FREQUENCY.EVERY_15_MINUTES.value) {
    minutes = 45;
  }

  return HOURS_LIST.map(
    (hour) =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(minutes + scheduleStartMinute, 'm')
        .format('LT'),
    Number
  );
};

export const getMetadata = ({ scheduleDetails, scheduleStartMinute }) => {
  const startTimeData = HOURS_LIST.map(
    (hour) =>
      moment()
        .startOf('day')
        .add(hour, 'h')
        .add(scheduleStartMinute || 0, 'm')
        .format('LT'),
    Number
  );
  const startTimeOptions = [];
  const endTimeOptions = [];

  startTimeData.forEach((opt) => {
    startTimeOptions.push({ label: opt, value: opt });
  });

  if (scheduleDetails && scheduleDetails.endTimeOptions) {
    scheduleDetails.endTimeOptions.forEach((opt) => {
      endTimeOptions.push({ label: opt, value: opt });
    });
  }

  return {
    fieldMap: {
      frequency: {
        id: 'frequency',
        name: 'frequency',
        type: 'select',
        label: 'Frequency',
        helpKey: 'flow.frequency',
        defaultValue: scheduleDetails.frequency,
        options: [
          {
            items: Object.keys(FREQUENCY).map((k) => FREQUENCY[k]),
          },
        ],
        skipSort: true,
      },
      startTime: {
        id: 'startTime',
        name: 'startTime',
        type: 'select',
        label: 'Start time',
        helpKey: 'flow.startTime',
        defaultValue: scheduleDetails.startTime,
        options: [
          {
            items: startTimeOptions,
          },
        ],
        skipSort: true,
        visibleWhenAll: [
          {
            field: 'frequency',
            isNot: ['', FREQUENCY.MANUAL.value],
          },
        ],
        description:
          'Please note that start time represents when your flow will get placed in the queue for processing. The actual run time for your flow may vary based on the current message load in your queue, or other flows that are ahead of your flow in the global integrator.io scheduler. Please note also that the list of available start times is subject to change over time to help maintain balance regarding the total number of flows that are starting at any specific time.',
      },
      endTime: {
        id: 'endTime',
        name: 'endTime',
        type: 'select',
        label: 'End time',
        helpKey: 'flow.endTime',
        defaultValue: scheduleDetails.endTime,
        omitWhenHidden: true,
        options: [
          {
            items: endTimeOptions,
          },
        ],
        skipSort: true,
        refreshOptionsOnChangesTo: ['frequency'],
        visibleWhenAll: [
          {
            field: 'frequency',
            isNot: [
              '',
              FREQUENCY.MANUAL.value,
              FREQUENCY.ONCE_WEEKLY.value,
              FREQUENCY.ONCE_DAILY.value,
              FREQUENCY.TWICE_DAILY.value,
            ],
          },
        ],
      },
      daysToRunOn: {
        id: 'daysToRunOn',
        name: 'daysToRunOn',
        type: 'multiselect',
        helpKey: 'flow.daysToRunOn',
        label: 'Days to run on',
        defaultValue: scheduleDetails.daysToRunOn,
        options: [
          {
            items: Object.keys(WEEK_DAYS).map((d) => ({
              value: d,
              label: WEEK_DAYS[d],
            })),
          },
        ],
        skipSort: true,
        visibleWhenAll: [
          {
            field: 'frequency',
            isNot: ['', FREQUENCY.MANUAL.value, FREQUENCY.ONCE_WEEKLY.value],
          },
        ],
      },
      dayToRunOn: {
        id: 'dayToRunOn',
        name: 'dayToRunOn',
        helpKey: 'flow.daysToRunOn',
        type: 'select',
        label: 'Day to run on',
        defaultValue: scheduleDetails.daysToRunOn[0],
        options: [
          {
            items: Object.keys(WEEK_DAYS).map((d) => ({
              value: d,
              label: WEEK_DAYS[d],
            })),
          },
        ],
        skipSort: true,
        visibleWhenAll: [
          {
            field: 'frequency',
            is: [FREQUENCY.ONCE_WEEKLY.value],
          },
        ],
      },
    },
    layout: {
      fields: [
        'frequency',
        'startTime',
        'endTime',
        'daysToRunOn',
        'dayToRunOn',
      ],
      type: 'collapse',
    },
    optionsHandler: (fieldId, fields) => {
      if (fieldId === 'endTime') {
        const frequency = fields.find((field) => field.id === 'frequency')
          .value;
        const options = getEndTimeOptions(frequency, scheduleStartMinute);

        return [
          {
            items:
              (options &&
                options.map((opt) => ({
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

export const getScheduleDetails = (flow, scheduleStartMinute) => {
  const details = { ...flow.scheduleDetails };
  if (!details.frequency) {
    details.frequency = FREQUENCY.MANUAL.value;
  }
  details.endTimeOptions = getEndTimeOptions(
    details.frequency,
    scheduleStartMinute
  );
  details.daysToRunOn = [];
  Object.keys(WEEK_DAYS).forEach((d) => {
    if (details[d.toLowerCase()] === d) {
      details.daysToRunOn.push(d);
    }
  });

  return details;
};

export default { getCronExpression, getMetadata };
