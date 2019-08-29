export default {
  'mongodb.method': {
    type: 'radiogroup',
    label: 'Mongodb method',
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
  'mongodb.ignoreExisting': {
    type: 'checkbox',
    label: 'Ignore Existing',
    defaultValue: false,
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.identifyExistingRecords': {
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
        field: 'mongodb.ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
    requiredWhen: [
      {
        field: 'mongodb.ignoreExisting',
        is: [true],
      },
      {
        field: 'mongodb.method',
        is: ['insertMany'],
      },
    ],
  },
  'mongodb.whichField': {
    type: 'text',
    label: 'Which Field?',
    visibleWhen: [
      {
        field: 'mongodb.identifyExistingRecords',
        is: ['source'],
      },
    ],
    requiredWhen: [
      {
        field: 'mongodb.identifyExistingRecords',
        is: ['source'],
      },
    ],
  },
  'mongodb.ignoreLookupFilters': {
    type: 'textarea',
    label: 'Ignore Lookup Filters',
    visibleWhen: [
      {
        field: 'mongodb.identifyExistingRecords',
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
  'mongodb.ignoreMissing': {
    type: 'checkbox',
    label: 'Ignore Missing',
    visibleWhen: [
      {
        field: 'mongodb.method',
        is: ['updateOne'],
      },
    ],
  },
  'mongodb.whichField?': {
    type: 'text',
    label: 'Which Field?',
    visibleWhen: [
      {
        field: 'mongodb.ignoreMissing',
        is: [true],
      },
    ],
    requiredWhen: [
      {
        field: 'mongodb.ignoreMissing',
        is: [true],
      },
    ],
  },
};
