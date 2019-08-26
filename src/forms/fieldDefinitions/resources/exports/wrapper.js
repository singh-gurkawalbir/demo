export default {
  'wrapper.function': {
    type: 'text',
    label: 'Wrapper function',
    required: true,
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Wrapper configuration',
  },
  type: {
    type: 'select',
    label: 'Export Type',
    required: true,
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Test', value: 'test' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
        ],
      },
    ],
  },
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
  'once.booleanField': {
    type: 'text',
    label: 'Boolean Field',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
  },
};
