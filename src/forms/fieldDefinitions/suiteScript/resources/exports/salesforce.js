export default {
  'export.salesforce.sObjectType': {
    label: 'SObjectType',
    connectionId: r => r.export._connectionId,
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
    fieldId: 'export.salesforce.sObjectType',
    type: 'refreshableselect',
    filterKey: 'salesforce-sObjects',
    commMetaPath: r =>
      `suitescript/connections/${r.ssLinkedConnectionId}/connections/${r.export._connectionId}/sObjectTypes`,
  },
  'export.salesforce.errorMessageField.id': {
    label: 'Log Error Messages Back in Salesforce',
    fieldId: 'export.salesforce.errorMessageField.id',
    type: 'refreshableselect',
    filterKey: 'salesforce-textFields',
    refreshOptionsOnChangesTo: ['export.salesforce.sObjectType'],
    visibleWhenAll: [{ field: 'export.salesforce.sObjectType', isNot: [''] }],
  },
  'export.salesforce.netsuiteIdField': {
    label: 'Store NetSuite Id Back in Salesforce',
    fieldId: 'export.salesforce.netsuiteIdField',
    type: 'refreshableselect',
    filterKey: 'salesforce-textFields',
    refreshOptionsOnChangesTo: ['export.salesforce.sObjectType'],
    visibleWhenAll: [{ field: 'export.salesforce.sObjectType', isNot: [''] }],
  },
  'export.salesforce.soql': {
    label: 'SOQL Query',
    fieldId: 'export.salesforce.soql',
    type: 'suitescriptsoqlquery',
    connectionId: r => r.export._connectionId,
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
    omitWhenHidden: true,
    filterKey: 'salesforce-soqlQuery',
    required: true,
    multiline: true,
  },
  'export.salesforce.exportType': {
    type: 'select',
    label: 'Export type',
    required: true,
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
          { label: 'Test', value: 'test' },
        ],
      },
    ],
    defaultValue: r =>
      (r &&
        r.export &&
        r.export.salesforce &&
        r.export.salesforce.exportType) ||
      'all',
  },
  'export.salesforce.booleanField': {
    label: 'Boolean field',
    fieldId: 'export.salesforce.booleanField',
    type: 'suitescriptsalesforcerefreshableselect',
    connectionId: r => r.export._connectionId,
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
    filterKey: 'salesforce-recordType',
    fieldName: 'onceExportBooleanFields',
    refreshOptionsOnChangesTo: ['export.salesforce.soql'],
    visibleWhenAll: [
      { field: 'export.salesforce.soql', isNot: [''] },
      { field: 'export.salesforce.exportType', is: ['once'] },
    ],
  },
  'export.salesforce.soqlErrorMessageField.id': {
    label: 'Log Error Messages Back in Salesforce',
    fieldId: 'export.salesforce.soqlErrorMessageField.id',
    type: 'suitescriptsalesforcerefreshableselect',
    connectionId: r => r.export._connectionId,
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
    defaultValue: r =>
      r &&
      r.export &&
      r.export.salesforce &&
      r.export.salesforce.errorMessageField &&
      r.export.salesforce.errorMessageField.id,
    filterKey: 'salesforce-textFields',
    refreshOptionsOnChangesTo: ['export.salesforce.soql'],
    visibleWhenAll: [
      { field: 'export.salesforce.soql', isNot: [''] },
      { field: 'export.salesforce.exportType', isNot: ['', 'delta'] },
    ],
  },
};
