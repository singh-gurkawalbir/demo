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
};
