export default {
  'salesforce.sObjectType': {
    type: 'text',
    label: 'SObject Type',
    required: true,
    defaultValue: r => r && r.salesforce && r.salesforce.sObjectType,
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
  'salesforce.executionType': {
    type: 'radiogroup',
    label: 'Execution Type',
    defaultValue: r =>
      r && r.salesforce && r.salesforce.soql && r.salesforce.soql.query
        ? 'scheduled'
        : 'realtime',
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
    omitWhenHidden: true,
    defaultValue: r =>
      r && r.salesforce && r.salesforce.soql && r.salesforce.soql.query,
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
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
    ],
  },
  'salesforce.distributed.requiredTrigger': {
    type: 'text',
    label: 'Required Trigger',
    multiline: true,
    omitWhenHidden: true,
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
    omitWhenHidden: true,
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
