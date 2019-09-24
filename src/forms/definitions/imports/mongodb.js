export default {
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
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
    hooks: { formId: 'hooks' },
    'hooks.postAggregate.function': { fieldId: 'hooks.postAggregate.function' },
    'hooks.postAggregate._scriptId': {
      fieldId: 'hooks.postAggregate._scriptId',
    },
    'hooks.postAggregate._stackId': { fieldId: 'hooks.postAggregate._stackId' },
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
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'Hooks (Optional, Developers Only)',
        fields: [
          'hooks',
          'hooks.postAggregate.function',
          'hooks.postAggregate._scriptId',
          'hooks.postAggregate._stackId',
        ],
      },
    ],
  },
};
