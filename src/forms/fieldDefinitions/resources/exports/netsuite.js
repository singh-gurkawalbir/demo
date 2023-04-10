export default {
  // record types
  'netsuite.distributed.recordType': {
    isLoggable: true,
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    placeholder: 'Please select a record type',
    helpKey: 'export.netsuite.recordType',
    connectionId: r => r && r._connectionId,
  },
  'netsuite.restlet.recordType': {
    isLoggable: true,
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'restlet-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['restlet'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
  },
  'netsuite.webservices.recordType': {
    isLoggable: true,
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/webservices/connections/${r._connectionId}/recordTypes?recordTypeOnly=true`,
    filterKey: 'webservices-recordTypes',
    placeholder: 'Please select a record type',
    helpKey: 'export.netsuite.searches.recordType',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['search'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].recordType,
  },
  // execution context
  'netsuite.distributed.executionContext': {
    isLoggable: true,
    type: 'multiselect',
    label: 'Execution context',
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
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
          { label: 'Web Application', value: 'webapplication' },
        ],
      },
    ],
    defaultValue: r =>
      (r &&
        r.netsuite &&
        r.netsuite.distributed &&
        r.netsuite.distributed.executionContext) || [
        'userinterface',
        'webstore',
      ],
    required: true,
  },
  // executiontype
  'netsuite.distributed.executionType': {
    isLoggable: true,
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
    defaultValue: r =>
      (r &&
        r.netsuite &&
        r.netsuite.distributed &&
        r.netsuite.distributed.executionType) || ['create', 'edit', 'xedit'],
    required: true,
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
  },
  // sublists
  'netsuite.distributed.sublists': {
    isLoggable: true,
    label: 'Sublists to include',
    type: 'refreshableselect',
    filterKey: 'suitescript-sublists',
    multiselect: true,
    placeholder: 'Please select Sublists',
    helpKey: 'export.netsuite.sublists',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.distributed.recordType', isNot: [''] },
      { field: 'netsuite.execution.type', is: ['distributed'] },
    ],
  },
  // search id
  'netsuite.restlet.searchId': {
    isLoggable: true,
    type: 'nssavedsearch',
    required: true,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['restlet'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/savedSearches`,
    connectionId: r => r && r._connectionId,
  },
  // search id
  'netsuite.webservices.searchId': {
    isLoggable: true,
    label: 'Saved searches',
    type: 'nswssavedsearch',
    required: true,
    placeholder: 'Please select a saved search',
    filterKey: 'webservices-savedSearches',
    helpKey: 'export.netsuite.searches.searchId',
    visibleWhenAll: [
      { field: 'netsuite.webservices.recordType', isNot: [''] },
      { field: 'netsuite.api.type', is: ['search'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].savedSearchId,
    connectionId: r => r && r._connectionId,
  },
  // type
  // TODO(Mounika): Check if this is a ghost code. There is reference for type in subForms/netsuite/search.js

  type: {
    isLoggable: true,
    type: 'select',
    label: 'Export type',
    skipSort: true,
    options: [
      {
        items: [
          { label: 'All – always export all data', value: 'all' },
          { label: 'Delta – export only modified data', value: 'delta' },
          { label: 'Once – export records only once', value: 'once' },
          { label: 'Limit – export a set number of records', value: 'test' },
        ],
      },
    ],
    defaultValue: r => (r && r.type) || 'all',
  },
  // skip grouping
  'netsuite.skipGrouping': {
    isLoggable: true,
    type: 'checkbox',
    inverse: true,
    label: 'Group rows',
    defaultValue: r => {
      const skipGrouping =
        r && r.netsuite && r.netsuite && r.netsuite.skipGrouping;

      return skipGrouping === undefined ? true : skipGrouping;
    },
  },
  'netsuite.netsuiteExportlabel': {
    isLoggable: true,
    label: r => {
      if (r.resourceType === 'lookupFiles' || r.type === 'blob') {
        return 'What would you like to transfer?';
      }
      if (r.resourceType === 'realtime' || r.type === 'distributed') {
        return 'Configure real-time export in source application';
      }

      return 'What would you like to export?';
    },
    type: 'labeltitle',
  },
  'netsuite.searches': {
    isLoggable: true,
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'NetSuite searches',
    validWhen: [],
  },
  'netsuite.metadata': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite metadata',
  },
  'netsuite.export.forceReload': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Reload record before export',
  },
  'netsuite.selectoption': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite selectoption',
  },
  'netsuite.customFieldMetadata': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite custom field metadata',
  },
  'netsuite.statsOnly': {
    isLoggable: true,
    type: 'checkbox',
    label: 'NetSuite stats only',
  },
  'netsuite.internalId': {
    isLoggable: true,
    type: 'uri',
    required: true,
    label: 'File internal id',
    showExtract: false,
    showLookup: false,
  },
  'netsuite.blob.purgeFileAfterExport': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Purge file after export',
  },
  'netsuite.restlet.criteria.field': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet criteria field',
  },
  'netsuite.restlet.criteria.join': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet criteria join',
  },
  'netsuite.restlet.criteria.operator': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet criteria operator',
  },
  'netsuite.restlet.criteria.searchValue': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet criteria search value',
  },
  'netsuite.restlet.criteria.searchValue2': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet criteria search value2',
  },
  'netsuite.restlet.batchSize': {
    isLoggable: true,
    type: 'text',
    label: 'Batch size limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.criteria': {
    isLoggable: true,
    helpKey: 'export.netsuite.restlet.criteria',
    type: 'nssearchcriteria',
    label: 'Define search criteria',
    refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
    filterKey: 'suitescript-searchFilters',
    connectionId: r => r && r._connectionId,
  },
  'netsuite.webservices.criteria': {
    isLoggable: true,
    helpKey: 'export.netsuite.restlet.criteria',
    type: 'nssearchcriteria',
    label: 'Define search criteria',
    refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
    filterKey: 'webservices-searchFilters',
    connectionId: r => r && r._connectionId,
    disabledWhen: [
      { field: 'netsuite.webservices.recordType', is: [''] },
    ],
    defaultValue: r =>
      (r &&
        r.netsuite &&
        r.netsuite.searches &&
        r.netsuite.searches[0] &&
        r.netsuite.searches[0].criteria) ||
      [],
  },
  'netsuite.restlet.hooks.batchSize': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet hooks batch size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.preSend.fileInternalId': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet hooks pre send file internal ID',
  },
  'netsuite.restlet.hooks.preSend.function': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite restlet hooks pre send function',
  },
  'netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',
    label: 'NetSuite restlet hooks pre send configuration',
  },
  'netsuite.distributed.disabled': {
    isLoggable: true,
    type: 'checkbox',
    label: 'NetSuite distributed disabled',
  },
  'netsuite.distributed.qualifier': {
    isLoggable: true,
    label: 'Field specific qualification criteria',
    type: 'netsuitequalifier',
    placeholder: 'Define Qualification Criteria',
    helpKey: 'export.netsuite.qualifier',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.distributed.recordType', isNot: [''] },
      { field: 'netsuite.execution.type', is: ['distributed'] },
    ],
  },
  'netsuite.distributed.hooks.preSend.fileInternalId': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite distributed hooks pre send file internal ID',
  },
  'netsuite.distributed.hooks.preSend.function': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite distributed hooks pre send function',
  },
  'netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',
    label: 'NetSuite distributed hooks pre send configuration',
  },
  'netsuite.distributed.forceReload': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Reload record before export',
  },
  'netsuite.distributed.skipExportFieldId': {
    isLoggable: true,
    type: 'text',
    label: 'Skip export field ID',
  },
  'netsuite.distributed.ioEnvironment': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite distributed io environment',
  },
  'netsuite.distributed.lastSyncedDate': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite distributed last synced date',
  },
  'netsuite.distributed.settings': {
    type: 'text',
    label: 'NetSuite distributed settings',
  },
  'netsuite.getList[].typeId': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite get list type ID',
  },
  'netsuite.getList.internalId': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite get list internal ID',
  },
  'netsuite.getList.externalId': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite get list external ID',
  },
  'netsuite.searchPreferences.bodyFieldsOnly': {
    isLoggable: true,
    type: 'checkbox',
    label: 'NetSuite search preferences body fields only',
  },
  'netsuite.searchPreferences.pageSize': {
    isLoggable: true,
    type: 'text',
    label: 'NetSuite search preferences page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.searchPreferences.returnSearchColumns': {
    isLoggable: true,
    type: 'checkbox',
    label: 'NetSuite search preferences return search columns',
  },
};
