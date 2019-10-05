export default {
  'wrapper.function': {
    type: 'text',
    label: 'Function',
    required: true,
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Configuration',
  },
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
  },
  'once.booleanField': {
    type: 'text',
    label: 'Boolean Field',
    required: true,
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
