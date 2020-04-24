export default {
  'rdbms.query': {
    type: 'sqlquery',
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
    type: 'sqlquery',
    label: 'Configure once query',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
};
