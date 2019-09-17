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
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
  },
  'delta.lagOffset': {
    type: 'text',
    label: 'Offset',
  },
  'salesforce.executionType': {
    type: 'radiogroup',
    label: 'Execution Type',
    defaultValue: r => (r && r.salesforce && r.salesforce.executionType) || '',
    options: [
      {
        items: [
          { label: 'Real-time', value: 'realtime' },
          { label: 'Scheduled', value: 'scheduled' },
        ],
      },
    ],
  },
  'salesforce.soql.query': {
    type: 'editor',
    mode: 'sql',
    label: 'SOQL Query',
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['scheduled'],
      },
    ],
  },
  'salesforce.distributed.referencedFields': {
    type: 'text',
    keyName: 'name',
    multiline: true,
    valueName: 'value',
    valueType: 'array',
    label: 'Referenced Fields',
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
  'salesforce.distributed.qualifier': {
    type: 'text',
    label: 'Field Specific Qualification Criteria',
    multiline: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
  'salesforce.distributed.relatedLists.referencedFields': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Related Lists',
    multiline: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
};
