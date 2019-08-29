export default {
  'rdbms.query': {
    type: 'editor',
    mode: 'sql',
    label: 'Query',
    required: true,
  },
  'rdbms.once.query': {
    type: 'editor',
    mode: 'sql',
    label: 'Configure Once Query',
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
