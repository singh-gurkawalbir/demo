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
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.keyConditionExpression': {
    type: 'text',
    label: 'Key condition expression',
    required: true,
  },
  'dynamodb.filterExpression': {
    type: 'text',
    label: 'Filter expression',
  },
  'dynamodb.projectionExpression': {
    type: 'text',
    label: 'Projections',
    delimiter: ',',
  },
  'dynamodb.expressionAttributeNames': {
    type: 'editor',
    label: 'Expression attribute names',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      '{ "#n1":"Name","#n2":"Id"}',
  },
  'dynamodb.expressionAttributeValues': {
    type: 'editor',
    label: 'Expression attribute values',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeValues) ||
      '{ ":p1":"A",":p2":"1"}',
  },
  'dynamodb.onceExportPartitionKey': {
    type: 'text',
    label: 'Once export partition key',
    required: true,
  },
  'dynamodb.onceExportSortKey': {
    type: 'text',
    label: 'Once export sort key',
  },
};
