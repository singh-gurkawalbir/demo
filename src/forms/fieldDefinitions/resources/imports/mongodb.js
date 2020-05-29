export default {
  'mongodb.method': {
    type: 'radiogroupforresetfields',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
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
            label: 'InsertMany',
            value: 'insertMany',
          },
          {
            label: 'UpdateOne',
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
    label: 'How should we identify existing records?',
    required: true,
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
            label: 'Run a dynamic search against Mongodb',
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
    hideDefaultData: true,
    label: 'Launch query builder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    title: 'MongoDB Data Builder',
    ruleTitle:
      'Template (use handlebar expressions to map fields from your export data)',
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
    hideDefaultData: true,
    label: 'Launch query builder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    title: 'MongoDB Data Builder',
    ruleTitle:
      'Template (use handlebar expressions to map fields from your export data)',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.ignoreLookupFilter': {
    type: 'editor',
    mode: 'json',
    label: 'Ignore lookup filter',
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.lookupType',
        is: ['lookup'],
      },
    ],
  },
  'mongodb.filter': {
    type: 'editor',
    mode: 'json',
    label: 'Filter',
    required: true,
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.upsert': {
    type: 'checkboxforresetfields',
    label: 'Upsert',
    fieldsToReset: [{ id: 'ignoreMissing', type: 'checkbox' }],
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.ignoreExtract': {
    type: 'text',
    label: 'Which field?',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreMissing',
        is: [true],
      },
      {
        field: 'mongodb.lookupType',
        is: ['source'],
      },
    ],
  },
};
