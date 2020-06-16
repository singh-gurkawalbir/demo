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
      type: 'checkboxforresetfields',
      fieldsToReset: [{ id: 'mongodb.upsert', type: 'checkbox' }],
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
          'ignoreExisting',
          'mongodb.lookupType',
          'mongodb.ignoreLookupFilter',
          'mongodb.filter',
          'mongodb.upsert',
          'ignoreMissing',
          'mongodb.ignoreExtract',
          'mongodb.document',
          'mongodb.update',
        ],
      },
    ],
  },
};
