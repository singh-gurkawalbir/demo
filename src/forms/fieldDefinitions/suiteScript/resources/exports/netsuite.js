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
    label: 'Saved search',
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
    required: true,
  },
  'export.delta.dateField': {
    id: 'export.delta.dateField',
    label: 'Date field',
    type: 'refreshableselect',
    filterKey: 'suitescript-dateField',
    required: true,
    placeholder: 'Please select a date field',
    connectionId: r => r && r.ssLinkedConnectionId,
    refreshOptionsOnChangesTo: ['export.netsuite.restlet.recordType'],
    visibleWhenAll: [
      { field: 'export.netsuite.restlet.recordType', isNot: [''] },
      { field: 'export.type', is: ['delta'] },
    ],
  },
  'export.once.booleanField': {
    id: 'export.once.booleanField',
    label: 'Boolean field',
    type: 'refreshableselect',
    placeholder: 'Please select a Boolean field',
    filterKey: 'suitescript-booleanField',
    required: true,
    connectionId: r => r && r.ssLinkedConnectionId,
    refreshOptionsOnChangesTo: ['export.netsuite.restlet.recordType'],
    visibleWhenAll: [
      { field: 'export.netsuite.restlet.recordType', isNot: [''] },
      { field: 'export.type', is: ['once'] },
    ],
  },
  'export.valueDelta.exportedField': {
    id: 'export.valueDelta.exportedField',
    label: 'Quantity exported column',
    type: 'refreshableselect',
    placeholder: 'Please select a field',
    filterKey: 'suitescript-itemCustomNumberColumn',
    required: true,
    connectionId: r => r && r.ssLinkedConnectionId,
    refreshOptionsOnChangesTo: ['export.netsuite.restlet.recordType'],
    visibleWhenAll: [
      { field: 'export.netsuite.restlet.recordType', isNot: [''] },
      { field: 'export.type', is: ['tranlinedelta'] },
    ],
  },
  'export.valueDelta.pendingField': {
    id: 'export.valueDelta.pendingField',
    label: 'Quantity pending export column',
    type: 'refreshableselect',
    placeholder: 'Please select a field',
    filterKey: 'suitescript-itemCustomNumberColumn',
    required: true,
    connectionId: r => r && r.ssLinkedConnectionId,
    refreshOptionsOnChangesTo: ['export.netsuite.restlet.recordType'],
    visibleWhenAll: [
      { field: 'export.netsuite.restlet.recordType', isNot: [''] },
      { field: 'export.type', is: ['tranlinedelta'] },
    ],
  },
  'export.netsuite.realtime.recordType': {
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
  'export.netsuite.realtime.executionContext': {
    type: 'multiselect',
    label: 'Execution context',
    options: [
      {
        items: [
          { label: 'CSV Import', value: 'csvimport' },
          { label: 'Custom Mass Update', value: 'custommassupdate' },
          { label: 'Offline Client', value: 'offlineclient' },
          { label: 'Map/Reduce', value: 'mapreduce' },
          { label: 'Portlet', value: 'portlet' },
          { label: 'Restlet 2.0', value: 'restlet' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Suitelet / Restlet 1.0', value: 'suitelet' },
          { label: 'User Event', value: 'userevent' },
          { label: 'User Interface', value: 'userinterface' },
          { label: 'Web Services', value: 'webservices' },
          { label: 'Web Store', value: 'webstore' },
          { label: 'Workflow', value: 'workflow' },
        ],
      },
    ],
    required: true,
  },
  'export.netsuite.realtime.executionType': {
    type: 'multiselect',
    label: 'Execution type',
    options: [
      {
        items: [
          { label: 'Create', value: 'create' },
          { label: 'Edit', value: 'edit' },
          { label: 'Delete', value: 'delete' },
          { label: 'Inline Edit', value: 'xedit' },
          { label: 'Approve', value: 'approve' },
          { label: 'Cancel', value: 'cancel' },
          { label: 'Reject', value: 'reject' },
          { label: 'Pack', value: 'pack' },
          { label: 'Ship', value: 'ship' },
          { label: 'DropShip', value: 'dropship' },
          { label: 'Special Order', value: 'specialorder' },
          { label: 'Order Items', value: 'orderitems' },
          { label: 'Pay Bills', value: 'paybills' },
        ],
      },
    ],
    required: true,
  },
  'export.netsuite.realtime.exportType': {
    type: 'select',
    label: 'Export type',
    options: [
      {
        items: [
          { label: 'Always', value: 'always' },
          { label: 'Checkbox', value: 'checkbox' },
        ],
      },
    ],
    required: true,
  },
  'export.netsuite.realtime.checkboxField': {
    id: 'export.netsuite.realtime.checkboxField',
    label: 'Checkbox field',
    type: 'refreshableselect',
    placeholder: 'Please select a Checkbox field',
    filterKey: 'suitescript-booleanField',
    required: true,
    connectionId: r => r && r.ssLinkedConnectionId,
    refreshOptionsOnChangesTo: ['export.netsuite.realtime.recordType'],
    visibleWhenAll: [
      { field: 'export.netsuite.realtime.recordType', isNot: [''] },
      { field: 'export.netsuite.realtime.exportType', is: ['checkbox'] },
    ],
  },
};
