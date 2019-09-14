export default {
  fields: [
    { formId: 'common' },
    {
      id: 'apiType',
      type: 'labeltitle',
      label: 'Where would you like to import the data?',
    },
    { fieldId: 'salesforce.api' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'salesforce.sObjectType' },
    { fieldId: 'salesforce.operation' },
    { fieldId: 'salesforce.compositeOperation' },
    { fieldId: 'salesforce.idLookup.extract' },
    { fieldId: 'salesforce.idLookup.whereClause' },
    {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        {
          field: 'salesforce.operation',
          is: ['insert'],
        },
      ],
    },
    {
      fieldId: 'ignoreMissing',
      visibleWhen: [
        {
          field: 'salesforce.operation',
          is: ['update'],
        },
      ],
    },
    { fieldId: 'salesforce.upsertpicklistvalues.fullName' },
    { fieldId: 'salesforce.upsert.externalIdField' },
    { formId: 'dataMappings' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'fileTemplates' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
  ],
};
