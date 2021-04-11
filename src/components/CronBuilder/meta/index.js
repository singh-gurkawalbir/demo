const meta = {
  fieldMap: {
    everyNMinutes: {
      name: 'everyNMinutes',
      id: 'everyNMinutes',
      label: 'Every n minutes',
      type: 'slider',
      min: 5,
      max: 55,
      step: 5,
      unit: 'minute',

    },
    everySelectedMinute: {
      id: 'everySelectedMinute',
      name: 'everySelectedMinute',
      label: ' Each selected minute',
      type: 'groupedButton',

      unit: 'minute',

      options: [
        {
          items: [
            { label: '10', value: '10' },
            { label: '25', value: '25' },
            { label: '40', value: '40' },
            { label: '55', value: '55' },
          ],
        },
      ],
    },
    everyHour: {
      id: 'everyHour',
      name: 'everyHour',
      unit: 'hour',
      type: 'cronlabel',

    },
    everyNHours: {
      id: 'everyNHours',
      name: 'everyNHours',
      label: 'Every n hours',
      type: 'slider',
      unit: 'hour',
      min: 1,
      max: 23,
      step: 1,

    },
    eachSelectedHour: {
      id: 'eachSelectedHour',
      name: 'eachSelectedHour',
      label: 'Each selected',
      type: 'groupedButton',

      options: [
        {
          items: [
            { label: '00', value: '0' },
            { label: '01', value: '1' },
            { label: '02', value: '2' },
            { label: '03', value: '3' },
            { label: '04', value: '4' },
            { label: '05', value: '5' },
            { label: '06', value: '6' },
            { label: '07', value: '7' },
            { label: '08', value: '8' },
            { label: '09', value: '9' },
            { label: '10', value: '10' },
            { label: '11', value: '11' },
            { label: '12', value: '12' },
            { label: '13', value: '13' },
            { label: '14', value: '14' },
            { label: '15', value: '15' },
            { label: '16', value: '16' },
            { label: '17', value: '17' },
            { label: '18', value: '18' },
            { label: '19', value: '19' },
            { label: '20', value: '20' },
            { label: '21', value: '21' },
            { label: '22', value: '22' },
            { label: '23', value: '23' },
          ],
        },
      ],
    },
    everyDay: {
      id: 'everyDay',
      name: 'everyDay',
      unit: 'day',
      type: 'cronlabel',

    },
    eachDay: {
      id: 'eachDay',

      name: 'eachDay',
      label: 'Each selected day',
      type: 'groupedButton',

      options: [
        {
          items: [
            { label: '01', value: '1' },
            { label: '02', value: '2' },
            { label: '03', value: '3' },
            { label: '04', value: '4' },
            { label: '05', value: '5' },
            { label: '06', value: '6' },
            { label: '07', value: '7' },
            { label: '08', value: '8' },
            { label: '09', value: '9' },
            { label: '10', value: '10' },
            { label: '11', value: '11' },
            { label: '12', value: '12' },
            { label: '13', value: '13' },
            { label: '14', value: '14' },
            { label: '15', value: '15' },
            { label: '16', value: '16' },
            { label: '17', value: '17' },
            { label: '18', value: '18' },
            { label: '19', value: '19' },
            { label: '20', value: '20' },
            { label: '21', value: '21' },
            { label: '22', value: '22' },
            { label: '23', value: '23' },
            { label: '24', value: '24' },
            { label: '25', value: '25' },
            { label: '26', value: '26' },
            { label: '27', value: '27' },
            { label: '28', value: '28' },
            { label: '29', value: '29' },
            { label: '30', value: '30' },
            { label: '31', value: '31' },
          ],
        },
      ],
    },

    everyMonth: {
      id: 'everyMonth',
      name: 'everyMonth',
      unit: 'month',
      type: 'cronlabel',

    },
    eachMonth: {
      id: 'eachMonth',

      name: 'eachMonth',
      label: 'Each selected month',
      type: 'groupedButton',

      options: [
        {
          items: [
            { label: 'Jan', value: '1' },
            { label: 'Feb', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'Aug', value: '8' },
            { label: 'Sept', value: '9' },
            { label: 'Oct', value: '10' },
            { label: 'Nov', value: '11' },
            { label: 'Dec', value: '12' },
          ],
        },
      ],
    },

    everyWeek: {
      id: 'everyWeek',
      name: 'everyWeek',
      unit: 'week',
      type: 'cronlabel',

    },
    eachWeek: {
      id: 'eachWeek',

      name: 'eachWeek',
      label: 'Each selected day',
      type: 'groupedButton',

      options: [
        {
          items: [
            { label: 'Sunday', value: '0' },
            { label: 'Monday', value: '1' },
            { label: 'Tuesday', value: '2' },
            { label: 'Wednesday', value: '3' },
            { label: 'Thursday', value: '4' },
            { label: 'Friday', value: '5' },
            { label: 'Saturday', value: '6' },
          ],
        },
      ],
    },
  },
  layout: {
    type: 'tabWithoutSave',
    containers: [
      {
        label: 'Minute',
        type: 'tabWithoutSave',
        containers: [
          { label: 'Every n minutes', fields: ['everyNMinutes'] },
          {
            label: 'Each selected minute',
            fields: ['everySelectedMinute'],
          },
        ],
      },
      {
        label: 'Hour',
        type: 'tabWithoutSave',
        containers: [
          { label: 'Every hour', fields: ['everyHour'] },
          { label: 'Every n hours', fields: ['everyNHours'] },
          { label: 'Each selected hour', fields: ['eachSelectedHour'] },
        ],
      },
      {
        label: 'Day of month',
        type: 'tabWithoutSave',
        containers: [
          { label: 'Every day', fields: ['everyDay'] },
          { label: 'Each day', fields: ['eachDay'] },
        ],
      },
      {
        label: 'Month',
        type: 'tabWithoutSave',
        containers: [
          { label: 'Every month', fields: ['everyMonth'] },
          { label: 'Each month', fields: ['eachMonth'] },
        ],
      },
      {
        label: 'Day of week',
        type: 'tabWithoutSave',
        containers: [
          { label: 'Every week', fields: ['everyWeek'] },
          { label: 'Each week', fields: ['eachWeek'] },
        ],
      },
    ],
  },
};

export default meta;
