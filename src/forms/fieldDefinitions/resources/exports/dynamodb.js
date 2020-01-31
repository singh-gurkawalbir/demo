import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  'dynamodb.region': {
    type: 'select',
    label: 'Region',
    required: true,
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
    label: 'Table Name',
    required: true,
  },
  'dynamodb.keyConditionExpression': {
    type: 'text',
    label: 'Key Condition Expression',
    required: true,
  },
  'dynamodb.filterExpression': {
    type: 'text',
    label: 'Filter Expression',
  },
  'dynamodb.projectionExpression': {
    type: 'text',
    label: 'Projections',
    delimiter: ',',
  },
  'dynamodb.expressionAttributeNames': {
    type: 'editor',
    label: 'Expression Attribute Names',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      `{ "#n1":"Name","#n2":"Id"}`,
  },
  'dynamodb.expressionAttributeValues': {
    type: 'editor',
    label: 'Expression Attribute Values',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeValues) ||
      `{ ":p1":"A",":p2":"1"}`,
  },
  'dynamodb.onceExportPartitionKey': {
    type: 'text',
    label: 'Once Export Partition Key',
    required: true,
  },
  'dynamodb.onceExportSortKey': {
    type: 'text',
    label: 'Once Export Sort Key',
  },
};
