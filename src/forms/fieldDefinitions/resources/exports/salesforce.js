export default {
  'salesforce.sObjectType': {
    type: 'text',
    label: 'SObject Type',
    required: true,
  },
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
  'delta.lagOffset': {
    type: 'text',
    label: 'Offset',
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
  'salesforce.executionType': {
    type: 'radiogroup',
    label: 'Execution Type',
    options: [
      {
        items: [
          { label: 'Real-time', value: 'realTime' },
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
        is: ['realTime'],
      },
    ],
  },
  'salesforce.distributed.requiredTrigger': {
    type: 'text',
    label: 'Required Trigger',
    multiline: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realTime'],
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
        is: ['realTime'],
      },
    ],
  },
  'salesforce.distributed.relatedLists.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Related Lists',
    multiline: true,
    visibleWhen: [
      {
        field: 'salesforce.executionType',
        is: ['realTime'],
      },
    ],
  },
};
