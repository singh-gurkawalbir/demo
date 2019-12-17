import { isNewId } from '../../../../utils/resource';

export default {
  'salesforce.sObjectType': {
    type: 'text',
    label: 'SObject Type',
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
  'salesforce.distributed.sObjectType': {
    label: 'SObject Type',
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
    type: 'radiogroup',
    required: true,
    label: 'Execution Type',
    defaultValue: r => {
      const isNew = isNewId(r._id);

      if (r && r.isLookup) {
        return 'scheduled';
      }

      if (isNew)
        // if its create
        return '';

      const output =
        r && r.salesforce && r.salesforce.soql && r.salesforce.soql.query;

      return output ? 'scheduled' : 'realtime';
    },
    options: [
      {
        items: [
          { label: 'Real-time', value: 'realtime' },
          { label: 'Scheduled', value: 'scheduled' },
        ],
      },
    ],
    visible: r => !(r && r.isLookup),
    visibleWhen: r => {
      if (r && r.isLookup) return [];

      return [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ];
    },
  },
  'salesforce.soql.query': {
    type: 'editor',
    mode: 'sql',
    label: 'SOQL Query',
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
        is: ['records'],
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
        is: ['records'],
      },
    ],
  },
  'salesforce.distributed.qualifier': {
    label: 'Field Specific Qualification Criteria',
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
    helpKey: 'export.salesforce.qualifier',
    connectionId: r => r && r._connectionId,
  },
  'salesforce.distributed.relatedLists': {
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
        is: ['records'],
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
        is: ['blob'],
      },
    ],
  },
  'salesforce.objectType': {
    type: 'select',
    required: true,
    defaultValue: r => r && r.salesforce && r.salesforce.sObjectType,
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
        is: ['blob'],
      },
    ],
  },
};
