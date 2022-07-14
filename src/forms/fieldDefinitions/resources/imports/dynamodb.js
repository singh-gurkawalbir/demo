import { AWS_REGIONS_LIST } from '../../../../constants';

export default {
  'dynamodb.region': {
    isLoggable: true,
    type: 'select',
    label: 'Region',
    required: true,
    defaultValue: r => (r && r.dynamodb && r.dynamodb.region) || 'us-east-1',
    options: [
      {
        items: AWS_REGIONS_LIST,
      },
    ],
  },
  'dynamodb.method': {
    isLoggable: true,
    type: 'radiogroupforresetfields',
    label: 'Method',
    required: true,
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
      { id: 'dynamodb.ignoreExtract' },
    ],
    options: [
      {
        items: [
          {
            label: 'PutItem',
            value: 'putItem',
          },
          {
            label: 'UpdateItem',
            value: 'updateItem',
          },
        ],
      },
    ],
  },
  'dynamodb.tableName': {
    isLoggable: true,
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.partitionKey': {
    isLoggable: true,
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    label: 'Partition key',
    requiredWhen: [
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.sortKey': {
    isLoggable: true,
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    label: 'Sort key',
  },
  'dynamodb.itemDocument': {
    isLoggable: true,
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'DynamoDB query',
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['putItem'],
      },
    ],
  },
  'dynamodb.updateExpression': {
    isLoggable: true,
    type: 'text',
    label: 'Update expression',
    required: true,
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.conditionExpression': {
    isLoggable: true,
    type: 'text',
    label: 'Key condition expression',
  },
  'dynamodb.expressionAttributeNames': {
    isLoggable: true,
    type: 'editor',
    label: 'Expression attribute names',
    mode: 'json',
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      '{ "#n1":"Name","#n2":"Id"}',
    requiredWhen: [
      {
        field: 'dynamodb.conditionExpression',
        isNot: [''],
      },
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.expressionAttributeValues': {
    isLoggable: true,
    type: 'sqlquerybuilder',
    label: 'Expression attribute values',
    defaultValue: r => r?.dynamodb?.expressionAttributeValues,
    requiredWhen: [
      {
        field: 'dynamodb.conditionExpression',
        isNot: [''],
      },
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.ignoreExtract': {
    isLoggable: true,
    type: 'textwithflowsuggestion',
    showLookup: false,
    showSuggestionsWithoutHandlebar: true,
    label: 'Ignore extract',
    required: true,
  },
};
