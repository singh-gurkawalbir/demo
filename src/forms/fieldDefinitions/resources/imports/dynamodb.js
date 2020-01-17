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
  },
  'dynamodb.sortKey': {
    type: 'text',
    label: 'Sort Key',
    requiredWhen: [
      {
        field: 'dynamodb.partitionKey',
        isNot: [''],
      },
    ],
  },
  'dynamodb.itemDocument': {
    type: 'editor',
    hideDefaultData: true,
    label: 'Item Document',
    mode: 'json',
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
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.expressionAttributeValues': {
    type: 'editor',
    label: 'Expression Attribute Names',
    mode: 'json',
    required: true,
    visibleWhen: [
      {
        field: 'dynamodb.method',
        is: ['updateItem'],
      },
    ],
  },
  'dynamodb.ignoreExtract': {
    type: 'textwithlookupextract',
    label: 'Ignore Extract',
    required: true,
  },
};
