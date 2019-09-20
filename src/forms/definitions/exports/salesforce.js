export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'salesforce.executionType' },
    {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to export from Salesforce?',
      visibleWhen: [
        {
          field: 'salesforce.executionType',
          is: ['scheduled', 'realtime'],
        },
      ],
    },
    { fieldId: 'salesforce.soql.query' },
    {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'salesforce.executionType',
          is: ['scheduled'],
        },
      ],
    },
    { fieldId: 'delta.dateField' },
    { fieldId: 'delta.lagOffset' },
    { fieldId: 'once.booleanField' },
    { fieldId: 'salesforce.sObjectType' },
    { fieldId: 'salesforce.distributed.requiredTrigger' },
    { fieldId: 'salesforce.distributed.referencedFields' },
    { fieldId: 'salesforce.distributed.relatedLists' },
    { fieldId: 'salesforce.distributed.qualifier' },
  ],
  fieldSets: [
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: true,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};
