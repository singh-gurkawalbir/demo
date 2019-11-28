export default {
  'mongodb.method': {
    type: 'radiogroup',
    label: 'Method',
    options: [
      {
        items: [
          { label: 'InsertMany', value: 'insertMany' },
          { label: 'UpdateOne', value: 'updateOne' },
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
    options: [
      {
        items: [
          { label: 'Records have a specific field populated', value: 'source' },
          { label: 'Run a dynamic search against Mongodb', value: 'lookup' },
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
    requiredWhen: [
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
    arrayIndex: 0,
    label: 'Launch Query Builder',
    refreshOptionsOnChangesTo: ['mongodb.method'],
    title: 'MongoDB Data Builder',
  },
  'mongodb.ignoreLookupFilters': {
    type: 'textarea',
    label: 'Ignore Lookup Filters',
    visibleWhen: [
      {
        field: 'mongodb.lookupType',
        is: ['lookup'],
      },
    ],
  },
  'mongodb.filter': {
    type: 'textarea',
    label: 'Filter',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
    requiredWhen: [
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
    requiredWhen: [
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
