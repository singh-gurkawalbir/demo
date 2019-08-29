export default {
  'rdbms.queryType': {
    type: 'radiogroup',
    label: 'Query Type',
    required: true,
    options: [
      {
        items: [
          { label: 'Insert', value: 'INSERT' },
          { label: 'Update', value: 'UPDATE' },
          { label: 'Insert or Update', value: 'COMPOSITE' },
        ],
      },
    ],
  },
  'rdbms.ignoreExistingRecords': {
    type: 'checkbox',
    label: 'Ignore Existing Records',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT'],
      },
    ],
  },
  'rdbms.ignoreMissingRecords': {
    type: 'checkbox',
    label: 'Ignore Missing Records',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['UPDATE'],
      },
    ],
  },
  'rdbms.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
      {
        field: 'rdbms.ignoreExistingRecords',
        is: [true],
      },
      {
        field: 'rdbms.ignoreMissingRecords',
        is: [true],
      },
    ],
  },
};
