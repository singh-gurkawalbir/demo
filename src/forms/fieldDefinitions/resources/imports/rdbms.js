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
    defaultValue: r => {
      let toReturn = '';

      if (!r || !r.rdbms) {
        return toReturn;
      }

      if (r.rdbms.queryType) {
        if (
          r.rdbms.queryType.length > 1 ||
          r.ignoreMissing ||
          r.ignoreExisting
        ) {
          toReturn = 'COMPOSITE';
        } else if (r.rdbms.queryType && r.rdbms.queryType.length === 1) {
          [toReturn] = r.rdbms.queryType;
        }
      }

      return toReturn;
    },
  },
  'rdbms.query': {
    id: 'rdbms.query',
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder',
    refreshOptionsOnChangesTo: ['rdbms.lookups', 'rdbms.queryType'],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT', 'UPDATE'],
      },
    ],
  },
  'rdbms.queryInsert': {
    id: 'rdbms.queryInsert',
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder for Insert',
    refreshOptionsOnChangesTo: ['rdbms.lookups', 'rdbms.queryType'],
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
    arrayIndex: 0,
    label: 'Launch Query Builder for Update',
    refreshOptionsOnChangesTo: ['rdbms.lookups', 'rdbms.queryType'],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.ignoreExtract': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
    ],
  },
  'rdbms.updateExtract': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
      {
        field: 'ignoreMissing',
        is: [true],
      },
    ],
  },
};
