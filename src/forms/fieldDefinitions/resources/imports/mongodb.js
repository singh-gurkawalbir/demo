export default {
  'mongodb.method': {
    type: 'radiogroupforresetfields',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'mongodb.update', type: 'sqlquerybuilder' },
      { id: 'mongodb.document', type: 'sqlquerybuilder' },
      { id: 'mongodb.lookupType', type: 'select' },
      { id: 'mongodb.ignoreExtract', type: 'text' },
    ],
    label: 'Method',
    options: [
      {
        items: [
          {
            label: 'Insert many',
            value: 'insertMany',
          },
          {
            label: 'Update one',
            value: 'updateOne',
          },
        ],
      },
    ],
  },
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
    required: true,
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['insertMany', 'updateOne'],
      },
    ],
  },
  'mongodb.lookupType': {
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpText: 'Select an operation that will be performed in order to locate records in the destination application before attempting to sync the data in your flow. The search options available depend on the capabilities offered by the destination application.',
    defaultValue: r =>
      r && r.mongodb && r.mongodb.ignoreExtract ? 'source' : 'lookup',
    options: [
      {
        items: [
          {
            label: 'Records have a specific field populated',
            value: 'source',
          },
          {
            label: 'Run a dynamic search against MongoDB',
            value: 'lookup',
          },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.document': {
    id: 'mongodb.document',
    type: 'sqlquerybuilder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    label: 'MongoDB document',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.update': {
    id: 'mongodb.update',
    type: 'sqlquerybuilder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    label: 'MongoDB document',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.ignoreLookupFilter': {
    id: 'mongodb.ignoreLookupFilter',
    type: 'sqlquerybuilder',
    label: 'MongoDB filter',
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.lookupType',
        is: ['lookup'],
      },
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.filter': {
    id: 'mongodb.filter',
    type: 'sqlquerybuilder',
    label: 'MongoDB filter',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
    required: true,
  },
  'mongodb.ignoreExtract': {
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    label: 'Which field?',
    helpText: `Specify the field – or field path for nested fields – in your exported data that contains the information necessary to identify which records in the destination application will be ignored when importing data. integrator.io will check each exported record to see whether the field is populated. If so, the record will be ignored; otherwise, it will be imported. For example, if you specify the field customerID, then integrator.io will check the destination app for the value of the customerID field of each exported record before importing (field does not have a value) or ignoring (field has a value). <br/>
    If a field contains special characters, enclose it in square brackets: [field-name]. Brackets can also indicate an array item, such as items[*].id.`,
    required: true,
    visibleWhenAll: [
      {
        field: 'mongodb.lookupType',
        is: ['source'],
      },
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.upsert': {
    type: 'checkbox',
    label: 'Upsert',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
};
