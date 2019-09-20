export default {
  'salesforce.sObjectType': {
    type: 'text',
    label: 'SObject Type',
    required: true,
    defaultValue: r => (r && r.salesforce && r.salesforce.sObjectType) || '',
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
  'salesforce.id': {
    type: 'text',
    label: 'Salesforce id',
  },
  'salesforce.api': {
    type: 'radiogroup',
    label: 'Execution Type',
    defaultValue: r => (r && r.salesforce && r.salesforce.executionType) || '',
    options: [
      {
        items: [
          { label: 'Rest', value: 'rest' },
          { label: 'Soap', value: 'soap' },
        ],
      },
    ],
  },
  'salesforce.soql.query': {
    type: 'text',
    label: 'Salesforce soql query',
  },
  'salesforce.distributed.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.disabled': {
    type: 'checkbox',
    label: 'Salesforce distributed disabled',
  },
  'salesforce.distributed.connectorId': {
    type: 'text',
    label: 'Salesforce distributed connector Id',
  },
  'salesforce.distributed.userDefinedReferencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed user Defined Referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.qualifier': {
    type: 'text',
    label: 'Salesforce distributed qualifier',
  },
  'salesforce.distributed.relatedLists.referencedFields': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed related Lists referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.relatedLists.parentField': {
    type: 'text',
    label: 'Salesforce distributed related Lists parent Field',
  },
  'salesforce.distributed.relatedLists.sObjectType': {
    type: 'text',
    label: 'Salesforce distributed related Lists s Object Type',
  },
  'salesforce.distributed.relatedLists.filter': {
    type: 'text',
    label: 'Salesforce distributed related Lists filter',
  },
  'salesforce.distributed.relatedLists.orderBy': {
    type: 'text',
    label: 'Salesforce distributed related Lists order By',
  },
  'salesforce.distributed.relatedLists.userDefined': {
    type: 'text',
    label: 'Salesforce distributed related Lists user Defined',
  },
};
