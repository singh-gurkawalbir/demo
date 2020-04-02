export default {
  'rdbms.queryType': {
    type: 'radiogroupforresetfields',
    label: 'Query Type',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
      { id: 'rdbms.ignoreExtract', type: 'textwithlookupextract' },
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
    arrayIndex: 0,
    label: 'Launch Query Builder',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
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
    label: 'Launch Query Builder for Insert',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
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
    label: 'Launch Query Builder for Update',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.ignoreExtract': {
    label: 'Existing Data Id',
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
    label: 'Existing Data Id',
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
