export default {
  'export.netsuite.restlet.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r.ssLinkedConnectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r.ssLinkedConnectionId,
  },
  'export.netsuite.restlet.searchId': {
    type: 'nssavedsearch',
    required: true,
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r.ssLinkedConnectionId}/savedSearches`,
    connectionId: r => r && r.ssLinkedConnectionId,
  },
  'export.type': {
    type: 'select',
    label: 'Export type',
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
          { label: 'Test', value: 'test' },
          { label: 'Transaction Line Delta', value: 'tranlinedelta' },
        ],
      },
    ],
    defaultValue: r => (r && r.export && r.export.type) || 'all',
  },
  'export.delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
    visibleWhen: [{ field: 'export.type', is: ['delta'] }],
  },
  'export.once.booleanField': {
    type: 'text',
    label: 'Boolean Field',
    required: true,
    visibleWhen: [{ field: 'export.type', is: ['once'] }],
  },
  'export.valueDelta.exportedField': {
    type: 'text',
    label: 'Quantity Exported Column',
  },
  'export.valueDelta.pendingField': {
    type: 'text',
    label: 'Quantity Pending Export Column',
  },
  'export.netsuite.realtime.recordType': {
    label: 'RT Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r.ssLinkedConnectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r.ssLinkedConnectionId,
  },
};
