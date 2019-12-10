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

    delete retValues['/inputMode'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'mongodb.document' || fieldId === 'mongodb.update') {
      const queryTypeField = fields.find(
        field => field.fieldId === 'mongodb.method'
      );

      return {
        queryType: queryTypeField && queryTypeField.value,
      };
    }

    return null;
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
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
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhen: [
        {
          field: 'mongodb.method',
          is: ['updateOne'],
        },
      ],
    },
    'mongodb.ignoreExtract': {
      fieldId: 'mongodb.ignoreExtract',
    },
    dataMappings: {
      formId: 'dataMappings',
    },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'mongodb.method',
      'mongodb.collection',
      'ignoreExisting',
      'mongodb.lookupType',
      'mongodb.ignoreLookupFilter',
      'mongodb.filter',
      'mongodb.upsert',
      'ignoreMissing',
      'mongodb.ignoreExtract',
      'mongodb.document',
      'mongodb.update',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};
