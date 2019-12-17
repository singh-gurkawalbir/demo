export default {
  'rdbms.query': {
    type: 'editor',
    mode: 'sql',
    label: 'Query',
    validWhen: {
      someAreTrue: {
        message:
          'For delta exports please use lastExportDateTime or currentExportDateTime in the Query',
        conditions: [
          {
            field: 'type',
            isNot: {
              values: ['delta'],
            },
          },
          {
            matchesRegEx: {
              pattern: '(lastExportDateTime)|(currentExportDateTime)',
            },
          },
        ],
      },
    },
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
