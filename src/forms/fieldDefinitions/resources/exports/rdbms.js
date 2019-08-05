export default {
  'rdbms.query': {
    type: 'editor',
    mode: 'sql',
    label: 'Query',
  },
  'rdbms.once.query': {
    type: 'editor',
    mode: 'sql',
    label: 'Configure Once Query',
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
};
