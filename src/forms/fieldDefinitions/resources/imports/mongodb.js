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
    type: 'text',
    label: 'Which field?',
    required: true,
    visibleWhen: [
      {
        field: 'mongodb.lookupType',
        is: ['source'],
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
