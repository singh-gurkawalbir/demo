export default {
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'mongodb.document': {
      fieldId: 'mongodb.document',
    },
    'mongodb.method': { fieldId: 'mongodb.method' },
    'mongodb.collection': { fieldId: 'mongodb.collection' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [{ field: 'mongodb.method', is: ['insertMany'] }],
    },
    'mongodb.lookupType': { fieldId: 'mongodb.lookupType' },
    'mongodb.ignoreLookupFilters': { fieldId: 'mongodb.ignoreLookupFilters' },
    'mongodb.filter': { fieldId: 'mongodb.filter' },
    'mongodb.upsert': { fieldId: 'mongodb.upsert' },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhen: [{ field: 'mongodb.method', is: ['updateOne'] }],
    },
    'mongodb.ignoreExtract': { fieldId: 'mongodb.ignoreExtract' },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'mongodb.method',
      'mongodb.collection',
      'ignoreExisting',
      'mongodb.lookupType',
      'mongodb.ignoreLookupFilters',
      'mongodb.filter',
      'mongodb.upsert',
      'ignoreMissing',
      'mongodb.ignoreExtract',
      'mongodb.document',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};
