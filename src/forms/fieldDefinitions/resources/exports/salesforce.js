export default {
  'salesforce.sObjectType': {
    type: 'text',
    label: 'SObject Type',
    required: true,
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
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
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'salesforce.soql.query': {
    type: 'editor',
    mode: 'sql',
    label: 'SOQL Query',
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['scheduled'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
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
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'salesforce.distributed.requiredTrigger': {
    type: 'text',
    label: 'Required Trigger',
    multiline: true,
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'salesforce.distributed.qualifier': {
    type: 'text',
    label: 'Field Specific Qualification Criteria',
    multiline: true,
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'salesforce.distributed.relatedLists.referencedFields': {
    type: 'text',
    delimiter: ',',
    label: 'Related Lists',
    multiline: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'salesforce.id': {
    type: 'text',
    label: 'Id',
    required: true,
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['BLOB'],
      },
    ],
  },
  'salesforce.objecttype': {
    type: 'select',
    required: true,
    label: 'SObject Type',
    options: [
      {
        items: [
          { label: 'Attachment', value: 'attachment' },
          { label: 'Content Version', value: 'contentVersion' },
          { label: 'Document', value: 'document' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['BLOB'],
      },
    ],
  },
};
