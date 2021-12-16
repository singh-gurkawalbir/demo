export default {
  'rdbms.query': {
    loggable: true,
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
    loggable: true,
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
