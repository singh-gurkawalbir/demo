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
    type: 'select',
    label: 'Method',
    options: [
      {
        items: [{ label: 'Query', value: 'query' }],
      },
    ],
    defaultValue: 'query',
    visible: false,
  },
  'dynamodb.tableName': {
    isLoggable: true,
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.keyConditionExpression': {
    isLoggable: true,
    type: 'text',
    label: 'Key condition expression',
    required: true,
  },
  'dynamodb.filterExpression': {
    isLoggable: true,
    type: 'text',
    label: 'Filter expression',
  },
  'dynamodb.projectionExpression': {
    isLoggable: true,
    type: 'text',
    label: 'Projections',
    delimiter: ',',
  },
  'dynamodb.expressionAttributeNames': {
    isLoggable: true,
    type: 'editor',
    label: 'Expression attribute names',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      '{ "#n1":"Name","#n2":"Id"}',
  },
  'dynamodb.expressionAttributeValues': {
    isLoggable: true,
    type: 'sqlquerybuilder',
    label: 'Expression attribute values',
    required: true,
    defaultValue: r => r?.dynamodb?.expressionAttributeValues,
  },
  'dynamodb.onceExportPartitionKey': {
    isLoggable: true,
    type: 'text',
    label: 'Once export partition key',
    required: true,
  },
  'dynamodb.onceExportSortKey': {
    isLoggable: true,
    type: 'text',
    label: 'Once export sort key',
  },
};
