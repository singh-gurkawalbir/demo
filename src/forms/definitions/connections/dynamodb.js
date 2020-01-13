export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'dynamodb.aws.accessKeyId': { fieldId: 'dynamodb.aws.accessKeyId' },
    'dynamodb.aws.secretAccessKey': {
      fieldId: 'dynamodb.aws.secretAccessKey',
    },
  },
  layout: {
    fields: [
      'name',
      'dynamodb.aws.accessKeyId',
      'dynamodb.aws.secretAccessKey',
    ],
  },
};
