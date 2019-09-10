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
    {
      id: 'salesforce.distributed.requiredTrigger',
      type: 'text',
      label: 'Required Trigger',
      multiline: true,
      visibleWhen: [
        {
          field: 'salesforce.executionType',
          is: ['realtime'],
        },
      ],
    },
    { fieldId: 'salesforce.distributed.referencedFields' }, // TODO need to  modify the field once enhancemnt done.
    { fieldId: 'salesforce.distributed.relatedLists.referencedFields' }, // TODO need to modify field once enhancemnt done.
    { fieldId: 'salesforce.distributed.qualifier' }, // TODO need to modify field once enhancemnt done.
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
