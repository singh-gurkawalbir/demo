export default {
  'dynamodb.region': {
    type: 'select',
    label: 'Region',
    required: true,
    options: [
      {
        items: [
          {
            label: 'US East (N. Virginia) [us-east-1]',
            value: 'us-east-1',
          },
          {
            label: 'US West (N. California) [us-west-1]',
            value: 'us-west-1',
          },
          {
            label: 'US West (Oregon) [us-west-2]',
            value: 'us-west-2',
          },
          {
            label: 'EU (Ireland) [eu-west-1]',
            value: 'eu-west-1',
          },
          {
            label: 'EU (Frankfurt) [eu-central-1]',
            value: 'eu-central-1',
          },
          {
            label: 'Asia Pacific (Tokyo) [ap-northeast-1]',
            value: 'ap-northeast-1',
          },
          {
            label: 'Asia Pacific (Seoul) [ap-northeast-2]',
            value: 'ap-northeast-2',
          },
          {
            label: 'Asia Pacific (Singapore) [ap-southeast-1]',
            value: 'ap-southeast-1',
          },
          {
            label: 'Asia Pacific (Sydney) [ap-southeast-2]',
            value: 'ap-southeast-2',
          },
          {
            label: 'South America (São Paulo) [sa-east-1]',
            value: 'sa-east-1',
          },
          {
            label: 'China (Beijing) [cn-north-1]',
            value: 'cn-north-1',
          },
          {
            label: 'US East (Ohio) [us-east-2]',
            value: 'us-east-2',
          },
          {
            label: 'Canada (Central) [ca-central-1]',
            value: 'ca-central-1',
          },
          {
            label: 'Asia Pacific (Mumbai) [ap-south-1]',
            value: 'ap-south-1',
          },
          {
            label: 'EU (London) [eu-west-2]',
            value: 'eu-west-2',
          },
          {
            label: 'EU (Stockholm) [eu-north-1]',
            value: 'eu-north-1',
          },
        ],
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
