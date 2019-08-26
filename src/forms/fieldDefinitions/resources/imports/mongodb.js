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
  },
  'mongodb.whichField': {
    type: 'text',
    label: 'which Field?',
    visibleWhen: [
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
  },
  'mongodb.parentOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: 'false',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  'mongodb.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'mongodb.parentOption',
        is: ['true'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Aggregate Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Aggregate Stack Id',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
};
