import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  'dynamodb.region': {
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
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.partitionKey': {
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
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    label: 'Sort key',
  },
  'dynamodb.itemDocument': {
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    hideDefaultData: true,
    ruleTitle:
      'Template (use handlebar expressions to map fields from your export data)',
    label: 'Launch query builder',
    title: 'DynamoDB Query Builder',
    refreshOptionsOnChangesTo: ['dynamodb.method'],
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['putItem'],
      },
    ],
  },
  'dynamodb.updateExpression': {
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
    type: 'text',
    label: 'Key condition expression',
  },
  'dynamodb.expressionAttributeNames': {
    type: 'editor',
    label: 'Expression attribute names',
    mode: 'json',
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      `{ "#n1":"Name","#n2":"Id"}`,
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
    type: 'editor',
    label: 'Expression attribute values',
    mode: 'json',
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeValues) ||
      `{ ":p1":"A",":p2":"1"}`,
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
    type: 'textwithflowsuggestion',
    showLookup: false,
    showSuggestionsWithoutHandlebar: true,
    label: 'Ignore extract',
    required: true,
  },
};
