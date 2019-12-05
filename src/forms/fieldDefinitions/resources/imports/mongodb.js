export default {
  'mongodb.method': {
    type: 'radiogroup',
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
      r && r.mongodb && r.mongodb.ignoreLookupFilter ? 'lookup' : 'source',
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
    arrayIndex: 0,
    label: 'Launch Query Builder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    title: 'MongoDB Data Builder',
  },
  'mongodb.ignoreLookupFilter': {
    type: 'textarea',
    label: 'Ignore Lookup Filter',
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
    type: 'checkbox',
    label: 'Upsert',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.ignoreExtract': {
    type: 'text',
    label: 'Which Field?',
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
