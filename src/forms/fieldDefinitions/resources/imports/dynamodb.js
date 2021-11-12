import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  'dynamodb.region': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.partitionKey': {
    loggable: true,
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
    loggable: true,
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    label: 'Sort key',
  },
  'dynamodb.itemDocument': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: 'Key condition expression',
  },
  'dynamodb.expressionAttributeNames': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'textwithflowsuggestion',
    showLookup: false,
    showSuggestionsWithoutHandlebar: true,
    label: 'Ignore extract',
    required: true,
  },
};
