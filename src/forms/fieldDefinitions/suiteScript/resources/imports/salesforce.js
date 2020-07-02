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
    helpKey: 'import.salesforce.operation',
  },
  'import.salesforce.update.jsField': {
    label: 'Which NetSuite field should be used to update?',
    type: 'suitescriptnetsuiteupsertfield',
    visibleWhen: [
      {
        field: 'import.salesforce.operation',
        is: ['update'],
      },
    ],
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    required: true,
    helpKey: 'import.salesforce.update.jsField',
  },
  'import.salesforce.update.externalField': {
    label: 'Which Salesforce field should be used to update?',
    type: 'refreshableselect',
    filterKey: 'salesforce-recordType',
    visibleWhen: [
      {
        field: 'import.salesforce.operation',
        is: ['update'],
      },
    ],
    required: true,
    commMetaPath: r =>
      r &&
      r.import &&
      `suitescript/connections/${r.ssLinkedConnectionId}/connections/${r.import._connectionId}/sObjectTypes/${r.import.salesforce.sObjectType}`,
    connectionId: r => r && r.ssLinkedConnectionId,
    helpKey: 'import.salesforce.update.externalField',
  },
  'import.salesforce.upsert.jsField': {
    label: 'Which NetSuite field should be used to upsert?',
    type: 'suitescriptnetsuiteupsertfield',
    visibleWhen: [
      {
        field: 'import.salesforce.operation',
        is: ['upsert'],
      },
    ],
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    required: true,
    helpKey: 'import.salesforce.upsert.jsField',
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
    helpKey: 'import.salesforce.upsert.externalField',
  },
  'import.salesforce.salesforceIdField': {
    label: 'Store Salesforce Id back in NetSuite field',
    type: 'refreshableselect',
    filterKey: 'suitescript-salesforce-id-field',
    required: false,
    connectionId: r => r && r.ssLinkedConnectionId,
    recordType: r => r?.export?.netsuite?.restlet?.recordType || r?.export?.netsuite?.realtime?.recordType,
    helpKey: 'import.salesforce.salesforceIdField',
  },
};
