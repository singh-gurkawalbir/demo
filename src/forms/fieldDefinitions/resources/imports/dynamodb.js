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
    type: 'radiogroupforresetfields',
    label: 'Method',
    required: true,
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
      { id: 'dynamodb.ignoreExtract', type: 'textwithlookupextract' },
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
    label: 'Table Name',
    required: true,
  },
  'dynamodb.partitionKey': {
    type: 'text',
    label: 'Partition Key',
    requiredWhen: [
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.sortKey': {
    type: 'text',
    label: 'Sort Key',
  },
  'dynamodb.itemDocument': {
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder',
    title: 'DynamoDB Query Builder',
    refreshOptionsOnChangesTo: ['dynamodb.method'],
    defaultData: `SET #name = {{data.name}}, #id = {{data.id}}`,
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['putItem'],
      },
    ],
  },
  'dynamodb.updateExpression': {
    type: 'text',
    label: 'Update Expression',
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
    label: 'Condition Expression',
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
  'dynamodb.ignoreExtract': {
    type: 'textwithlookupextract',
    fieldType: 'ignoreExistingData',
    showLookup: false,
    adaptorType: r => r && r.adaptorType,
    connectionId: r => r && r._connectionId,
    label: 'Ignore Extract',
    required: true,
  },
};
