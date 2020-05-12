export default {
  'import.salesforce.sObjectType': {
    label: 'SObject type',
    type: 'refreshableselect',
    filterKey: 'salesforce-sObjects',
    commMetaPath: r =>
      r &&
      r.import &&
      `suitescript/connections/${r.ssLinkedConnectionId}/connections/${r.import._connectionId}/sObjectTypes`,
    connectionId: r => r && r.ssLinkedConnectionId,
    required: true,
    placeholder: 'Please select a sObject type',
    helpKey: 'import.salesforce.sObjectType',
  },
  'import.salesforce.operation': {
    type: 'radiogroupforresetfields',
    label: 'Operation',
    required: true,
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Upsert', value: 'upsert' },
        ],
      },
    ],
  },
  'import.salesforce.upsert.externalField': {
    label: 'Which Salesforce field should be used to upsert?',
    type: 'refreshableselect',
    filterKey: 'salesforce-externalIdFields',
    visibleWhen: [
      {
        field: 'import.salesforce.operation',
        is: ['upsert'],
      },
    ],
    required: true,
    commMetaPath: r =>
      r &&
      r.import &&
      `suitescript/connections/${r.ssLinkedConnectionId}/connections/${r.import._connectionId}/sObjectTypes/${r.import.salesforce.sObjectType}`,
    connectionId: r => r && r.ssLinkedConnectionId,
  },
};
