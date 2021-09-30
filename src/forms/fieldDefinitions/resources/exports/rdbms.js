export default {
  'rdbms.query': {
    type: 'sqlquerybuilder',
    label: 'SQL query',
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
    type: 'sqlquerybuilder',
    label: 'SQL once query',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
};
