const batchSizePattern = /^([4-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|200)$/; // Regular Expression from regexnumericrangegenerator.

export default {
  'salesforce.sObjectType': {
    loggable: true,
    type: 'text',
    label: 'sObject type',
    required: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.batchSize': {
    loggable: true,
    type: 'text',
    label: 'Batch size',
    validWhen: {
      matchesRegEx: {
        pattern: batchSizePattern,
        message: 'Please enter a value between 4 and 200.',
      },
    },
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.skipExportFieldId': {
    loggable: true,
    type: 'text',
    label: 'Skip export field ID',
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.sObjectType': {
    loggable: true,
    label: 'sObject type',
    required: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.executionType': {
    loggable: true,
    type: 'radiogroup',
    required: true,
    label: 'Execution type',
    defaultValue: r => {
      if (r.resourceType === 'realtime' || r.type === 'distributed') return 'realtime';

      return 'scheduled';
    },
    options: [
      {
        items: [
          { label: 'Real-time', value: 'realtime' },
          { label: 'Scheduled', value: 'scheduled' },
        ],
      },
    ],
    visible: false,
  },
  'salesforce.soql.query': { // todo: this is probably a dead field, remove
    loggable: true,
    type: 'editor',
    mode: 'sql',
    label: 'SOQL query',
    omitWhenHidden: true,
    visible: r => !!(r && r.isLookup),
    visibleWhenAll: r => {
      if (r && r.isLookup) return [];

      return [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'salesforce.executionType',
          is: ['scheduled'],
        },
      ];
    },
  },
  'salesforce.distributed.referencedFields': {
    loggable: true,
    type: 'text',
    keyName: 'name',
    multiline: true,
    valueName: 'value',
    valueType: 'array',
    label: 'Referenced fields',
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.requiredTrigger': {
    loggable: true,
    type: 'text',
    label: 'Required trigger',
    multiline: true,
    omitWhenHidden: true,
    copyToClipboard: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.qualifier': {
    loggable: true,
    label: 'Field specific qualification criteria',
    omitWhenHidden: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    type: 'salesforcequalifier',
    placeholder: 'Define Qualification Criteria',
    connectionId: r => r && r._connectionId,
  },
  'salesforce.distributed.relatedLists': {
    loggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Related lists',
    helpKey: 'export.salesforce.distributed.relatedLists',
    multiline: true,
    visibleWhenAll: [
      {
        field: 'salesforce.executionType',
        is: ['realtime'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.id': {
    loggable: true,
    type: 'uri',
    label: 'Id',
    required: true,
    showExtract: false,
    showLookup: false,
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
    ],
  },
  'salesforce.objectType': {
    loggable: true,
    type: 'select',
    required: true,
    defaultValue: r => r && r.salesforce && r.salesforce.sObjectType,
    label: 'sObject type',
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
        is: ['blob'],
      },
    ],
  },
};
