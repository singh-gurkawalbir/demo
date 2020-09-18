export default {
  'rdbms.queryType': {
    type: 'radiogroupforresetfields',
    label: 'Query type',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
      { id: 'rdbms.ignoreExtract' },
    ],
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
    defaultValue: r => {
      let toReturn = '';

      if (!r || !r.rdbms) {
        return toReturn;
      }

      if (r.rdbms.queryType) {
        if (r.rdbms.queryType.length > 1) {
          toReturn = 'COMPOSITE';
        } else if (r.rdbms.queryType.length === 1) {
          [toReturn] = r.rdbms.queryType;
        }
      }

      return toReturn;
    },
  },
  'rdbms.query': {
    id: 'rdbms.query',
    type: 'sqlquerybuilder',
    querySetPos: 0,
    label: 'Query builder',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT', 'UPDATE'],
      },
    ],
  },
  'rdbms.bulkInsert.tableName': {
    id: 'rdbms.bulkInsert.tableName',
    type: 'text',
    label: 'Target table',
    helpText: 'Please enter the table name where the data needs to be inserted. Applicable only for bulk-inserts.',
    required: true,
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['BULK INSERT'],
      },
    ],
  },
  'rdbms.queryInsert': {
    id: 'rdbms.queryInsert',
    type: 'sqlquerybuilder',
    label: 'Query builder for insert',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.queryUpdate': {
    id: 'rdbms.queryUpdate',
    type: 'sqlquerybuilder',
    label: 'Query builder for update',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.ignoreExtract': {
    label: 'Existing data ID',
    required: true,
    defaultValue: r => {
      const val =
        r && r.rdbms && r.rdbms.ignoreLookupName
          ? r.rdbms.ignoreLookupName
          : r && r.rdbms && r.rdbms.ignoreExtract;

      return val || '';
    },
    visibleWhen: [
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
  'rdbms.updateExtract': {
    label: 'Existing data ID',
    required: true,
    defaultValue: r => {
      const val =
        r && r.rdbms && r.rdbms.updateLookupName
          ? r.rdbms.updateLookupName
          : r && r.rdbms && r.rdbms.updateExtract;

      return val || '';
    },
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
};
