export default {
  'rdbms.queryType': {
    isLoggable: true,
    type: 'queryradiogroup',
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
  'rdbms.query1': {
    isLoggable: true,
    id: 'rdbms.query1',
    dataTest: 'rdbms.query',
    type: 'sqlquerybuilder',
    helpKey: 'import.rdbms.query',
    arrayIndex: 0,
    label: 'SQL query',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT'],
      },
    ],
  },
  'rdbms.query2': {
    isLoggable: true,
    id: 'rdbms.query2',
    dataTest: 'rdbms.query',
    type: 'sqlquerybuilder',
    helpKey: 'import.rdbms.query',
    arrayIndex: 0,
    label: 'SQL query',
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['UPDATE'],
      },
    ],
  },
  'rdbms.bulkInsert.tableName': {
    isLoggable: true,
    id: 'rdbms.bulkInsert.tableName',
    type: 'uri',
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
    isLoggable: true,
    id: 'rdbms.queryInsert',
    type: 'sqlquerybuilder',
    helpKey: 'import.rdbms.query',
    label: 'SQL query (for inserts)',
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
    isLoggable: true,
    id: 'rdbms.queryUpdate',
    type: 'sqlquerybuilder',
    helpKey: 'import.rdbms.query',
    label: 'SQL query (for updates)',
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
  'rdbms.ignoreExistingExtract': {
    isLoggable: true,
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.ignoreExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    defaultValue: r => r.rdbms?.ignoreExtract,
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'rdbms.lookupType',
        is: ['source'],
      },
    ],
  },
  'rdbms.ignoreMissingExtract': {
    isLoggable: true,
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.ignoreExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    defaultValue: r => r.rdbms?.ignoreExtract,
    visibleWhenAll: [
      {
        field: 'ignoreMissing',
        is: [true],
      },
      {
        field: 'rdbms.lookupType',
        is: ['source'],
      },
    ],
  },
  'rdbms.ignoreExistingLookupName': {
    isLoggable: true,
    label: 'Lookup',
    type: 'selectlookup',
    omitWhenHidden: true,
    defaultValue: r => r.rdbms?.ignoreLookupName,
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    helpKey: 'import.lookup',
    required: true,
    visibleWhenAll: [
      {
        field: 'rdbms.lookupType',
        is: ['lookup'],
      },
      {
        field: 'ignoreExisting',
        is: [true],
      },
    ],
  },
  'rdbms.ignoreMissingLookupName': {
    isLoggable: true,
    label: 'Lookup',
    type: 'selectlookup',
    omitWhenHidden: true,
    required: true,
    helpKey: 'import.lookup',
    defaultValue: r => r.rdbms?.ignoreLookupName,
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    visibleWhenAll: [
      {
        field: 'rdbms.lookupType',
        is: ['lookup'],
      },
      {
        field: 'ignoreMissing',
        is: [true],
      },
    ],
  },
  'rdbms.lookupType': {
    isLoggable: true,
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpKey: 'import.lookupType',
    defaultValue: r => (r.rdbms?.updateLookupName || r.rdbms?.ignoreLookupName) ? 'lookup' : 'source',
    options: [
      {
        items: [
          {
            label: 'Records have a specific field populated',
            value: 'source',
          },
          {
            label: 'Run a dynamic lookup',
            value: 'lookup',
          },
        ],
      },
    ],
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
  'rdbms.updateExtract': {
    isLoggable: true,
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.ignoreExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    visibleWhenAll: [
      {
        field: 'rdbms.lookupType',
        is: ['source'],
      },
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.updateLookupName': {
    isLoggable: true,
    omitWhenHidden: true,
    label: 'Lookup',
    type: 'selectlookup',
    helpKey: 'import.lookup',
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    required: true,
    visibleWhenAll: [
      {
        field: 'rdbms.lookupType',
        is: ['lookup'],
      },
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
};
