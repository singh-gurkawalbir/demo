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
          is: ['scheduled', 'realTime'],
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
    {
      fieldId: 'delta.dateField',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'delta.lagOffset',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'once.booleanField',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    { fieldId: 'salesforce.sObjectType' },
    { fieldId: 'salesforce.distributed.requiredTrigger' },
    { fieldId: 'salesforce.distributed.referencedFields' },
    { fieldId: 'salesforce.distributed.relatedLists.referencedFields' },
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
