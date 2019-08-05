export default {
  'wrapper.function': {
    type: 'text',
    label: 'Wrapper function',
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Wrapper configuration',
  },
  type: {
    type: 'select',
    label: 'Export Type',
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
  exportData: {
    type: 'labeltitle',
    label: 'What would you like to Export?',
  },
};
