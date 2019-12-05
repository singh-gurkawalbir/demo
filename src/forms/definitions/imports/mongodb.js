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
    if (fieldId === 'mongodb.document') {
      const lookupField = fields.find(
        field => field.fieldId === 'mongodb.lookups'
      );
      const queryTypeField = fields.find(
        field => field.fieldId === 'mongodb.method'
      );

      return {
        queryType: queryTypeField && queryTypeField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
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
    'mongodb.lookups': {
      fieldId: 'mongodb.lookups',
      visible: false,
    },
    'mongodb.document': {
      fieldId: 'mongodb.document',
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
      'mongodb.lookups',
      'mongodb.document',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};
