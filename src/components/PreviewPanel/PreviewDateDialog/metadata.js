import dateTimezones from '../../../utils/dateTimezones';

export default {
  getMetadata: options => {
    const { timeZone, startDate, format } = options;
    const fieldMeta = {
      fieldMap: {
        timeZone: {
          id: 'timeZone',
          name: 'timeZone',
          type: 'select',
          label: 'Time zone',
          isLoggable: true,
          defaultValue: timeZone,
          required: true,
          options: [
            {
              items:
                (dateTimezones &&
                  dateTimezones.map(date => ({
                    label: date.value,
                    value: date.name,
                  }))),
            },
          ],
        },
        startDateCustom: {
          id: 'startDateCustom',
          name: 'startDateCustom',
          type: 'datetime',
          label: 'Start date/time',
          isLoggable: true,
          defaultValue: startDate,
          skipTimezoneConversion: true,
          format,
        },
      },
      layout: {
        fields: [
          'timeZone',
          'startDateCustom',
        ],
      },
    };

    return fieldMeta;
  },
};
