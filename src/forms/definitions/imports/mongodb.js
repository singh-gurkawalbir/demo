export default {
  preSave: formValues => {
    const retValues = {
      ...formValues,
    };

    if (
      retValues['/mongodb/ignoreExtract'] !== '' &&
      retValues['/mongodb/lookupType'] === 'source'
    ) {
      retValues['/mongodb/ignoreLookupFilter'] = undefined;
    } else if (
      retValues['/mongodb/ignoreLookupFilter'] !== '' &&
      retValues['/mongodb/lookupType'] === 'lookup'
    ) {
      retValues['/mongodb/ignoreExtract'] = undefined;
    }
    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    advancedSettings: { formId: 'advancedSettings' },
    'mongodb.document': {
      fieldId: 'mongodb.document',
    },
    'mongodb.update': {
      fieldId: 'mongodb.update',
    },
    'mongodb.method': {
      fieldId: 'mongodb.method',
    },
    'mongodb.collection': {
      fieldId: 'mongodb.collection',
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        {
          field: 'mongodb.method',
          is: ['insertMany'],
        },
      ],
    },
    'mongodb.lookupType': {
      fieldId: 'mongodb.lookupType',
    },
    'mongodb.ignoreLookupFilter': {
      fieldId: 'mongodb.ignoreLookupFilter',
    },
    'mongodb.filter': {
      fieldId: 'mongodb.filter',
    },
    'mongodb.upsert': {
      fieldId: 'mongodb.upsert',
    },
    'mongodb.ignoreExtract': {
      fieldId: 'mongodb.ignoreExtract',
    },
    dataMappings: {
      formId: 'dataMappings',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'mongodb.method',
          'mongodb.collection',
          'mongodb.filter',
          'mongodb.document',
          'ignoreExisting',
          'mongodb.lookupType',
          'mongodb.ignoreExtract',
          'mongodb.ignoreLookupFilter',
          'mongodb.update',
          'mongodb.upsert',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
