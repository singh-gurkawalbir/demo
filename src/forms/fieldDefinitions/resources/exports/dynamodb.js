export default {
  'dynamodb.region': {
    type: 'text',
    label: 'Region',
    required: true,
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
  },
  'dynamodb.expressionAttributeNames': {
    type: 'editor',
    label: 'Expression Attribute Names',
    mode: 'json',
    required: true,
  },
  'dynamodb.expressionAttributeValues': {
    type: 'editor',
    label: 'Expression Attribute Values',
    mode: 'json',
    required: true,
  },
  'dynamodb.onceExportPartitionKey': {
    type: 'text',
    label: 'Once Export Partition Key',
  },
  'dynamodb.onceExportSortKey': {
    type: 'text',
    label: 'Once Export Sort Key',
  },
};
