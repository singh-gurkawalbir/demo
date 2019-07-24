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
    label: 'Mongodb collection',
  },
  'mongodb.filter': {
    type: 'text',
    label: 'Mongodb filter',
  },
  'mongodb.document': {
    type: 'text',
    label: 'Mongodb document',
  },
  'mongodb.update': {
    type: 'text',
    label: 'Mongodb update',
  },
  'mongodb.upsert': {
    type: 'checkbox',
    label: 'Mongodb upsert',
    defaultValue: false,
  },
  'mongodb.ignoreExtract': {
    type: 'text',
    label: 'Mongodb ignore Extract',
  },
  'mongodb.ignoreLookupFilter': {
    type: 'text',
    label: 'Mongodb ignore Lookup Filter',
  },
};
