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
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'ignoreMissing',
        is: [true],
      },
    ],
  },
};
