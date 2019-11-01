export default {
  fieldMap: {
    common: { formId: 'common' },
    apiType: {
      id: 'apiType',
      type: 'labeltitle',
      label: 'Where would you like to import the data?',
    },
    'salesforce.api': { fieldId: 'salesforce.api' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'salesforce.sObjectType': { fieldId: 'salesforce.sObjectType' },
    'salesforce.operation': { fieldId: 'salesforce.operation' },
    'salesforce.compositeOperation': {
      fieldId: 'salesforce.compositeOperation',
    },
    'salesforce.idLookup.extract': { fieldId: 'salesforce.idLookup.extract' },
    'salesforce.idLookup.whereClause': {
      fieldId: 'salesforce.idLookup.whereClause',
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [{ field: 'salesforce.operation', is: ['insert'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhen: [{ field: 'salesforce.operation', is: ['update'] }],
    },
    'salesforce.upsertpicklistvalues.fullName': {
      fieldId: 'salesforce.upsertpicklistvalues.fullName',
    },
    'salesforce.upsert.externalIdField': {
      fieldId: 'salesforce.upsert.externalIdField',
    },
    dataMappings: { formId: 'dataMappings' },
    'salesforce.lookups': {
      fieldId: 'salesforce.lookups',
      visible: false,
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'apiType',
      'salesforce.api',
      'importData',
      'salesforce.lookups',
      'salesforce.sObjectType',
      'salesforce.operation',
      'salesforce.compositeOperation',
      'salesforce.idLookup.extract',
      'salesforce.idLookup.whereClause',
      'ignoreExisting',
      'ignoreMissing',
      'salesforce.upsertpicklistvalues.fullName',
      'salesforce.upsert.externalIdField',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
