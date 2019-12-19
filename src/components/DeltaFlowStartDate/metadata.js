import dateTimezones from '../../utils/dateTimezones';

export default {
  getMetadata: options => {
    const { timeZone, startDate, format } = options;
    const fieldMeta = {
      fieldMap: {
        deltaType: {
          id: 'deltaType',
          name: 'deltaType',
          type: 'radiogroup',
          label: '',
          defaultValue: 'automatic',
          options: [
            {
              items: [
                { label: 'Automatic', value: 'automatic' },
                { label: 'Custom', value: 'custom' },
              ],
            },
          ],
        },
        timeZone: {
          id: 'timeZone',
          name: 'timeZone',
          type: 'select',
          label: 'Time Zone',
          defaultValue: timeZone,
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
          visibleWhen: [{ field: 'deltaType', is: ['custom'] }],
          requiredWhen: [{ field: 'deltaType', is: ['custom'] }],
        },
        startDateAutomatic: {
          id: 'startDateAutomatic',
          name: 'startDateAutomatic',
          type: 'text',
          label: `Start Date/Time:`,
          defaultDisabled: true,
          defaultValue: startDate,
          visibleWhen: [{ field: 'deltaType', is: ['automatic'] }],
        },
        startDateCustom: {
          id: 'startDateCustom',
          name: 'startDateCustom',
          type: 'datetime',
          label: `Start Date/Time:`,
          defaultValue: startDate,
          requiredWhen: [{ field: 'deltaType', is: ['custom'] }],
          visibleWhen: [{ field: 'deltaType', is: ['custom'] }],
          format,
        },
      },
      layout: {
        fields: [
          'deltaType',
          'timeZone',
          'startDateAutomatic',
          'startDateCustom',
        ],
      },
    };

    return fieldMeta;
  },
};
