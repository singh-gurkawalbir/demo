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
    defaultValue: r =>
      r && r.rdbms && r.rdbms.queryType && r.rdbms.queryType[0],
  },
  'rdbms.query': {
    id: 'rdbms.query',
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder for Insert',
    refreshOptionsOnChangesTo: ['rdbms.lookups', 'rdbms.queryType'],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE', 'INSERT'],
      },
    ],
  },
  'rdbms.queryUpdate': {
    id: 'rdbms.queryUpdate',
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder for Update',
    refreshOptionsOnChangesTo: ['rdbms.lookups', 'rdbms.queryType'],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE', 'UPDATE'],
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
