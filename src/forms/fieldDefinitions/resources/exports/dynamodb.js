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
    loggable: true,
    type: 'text',
    label: 'Table name',
    required: true,
  },
  'dynamodb.keyConditionExpression': {
    loggable: true,
    type: 'text',
    label: 'Key condition expression',
    required: true,
  },
  'dynamodb.filterExpression': {
    loggable: true,
    type: 'text',
    label: 'Filter expression',
  },
  'dynamodb.projectionExpression': {
    loggable: true,
    type: 'text',
    label: 'Projections',
    delimiter: ',',
  },
  'dynamodb.expressionAttributeNames': {
    loggable: true,
    type: 'editor',
    label: 'Expression attribute names',
    mode: 'json',
    required: true,
    defaultValue: r =>
      (r && r.dynamodb && r.dynamodb.expressionAttributeNames) ||
      '{ "#n1":"Name","#n2":"Id"}',
  },
  'dynamodb.expressionAttributeValues': {
    loggable: true,
    type: 'sqlquerybuilder',
    label: 'Expression attribute values',
    required: true,
    defaultValue: r => r?.dynamodb?.expressionAttributeValues,
  },
  'dynamodb.onceExportPartitionKey': {
    loggable: true,
    type: 'text',
    label: 'Once export partition key',
    required: true,
  },
  'dynamodb.onceExportSortKey': {
    loggable: true,
    type: 'text',
    label: 'Once export sort key',
  },
};
