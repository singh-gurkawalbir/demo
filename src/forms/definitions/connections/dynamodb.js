export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'dynamodb.aws.accessKeyId': { fieldId: 'dynamodb.aws.accessKeyId' },
    'dynamodb.aws.secretAccessKey': {
      fieldId: 'dynamodb.aws.secretAccessKey',
    },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: false,
        label: 'Application details',
        fields: [
          'dynamodb.aws.accessKeyId',
          'dynamodb.aws.secretAccessKey',
        ],
      },
    ],
  },
};
