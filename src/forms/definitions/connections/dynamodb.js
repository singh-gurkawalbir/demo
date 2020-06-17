export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'dynamodb.aws.accessKeyId': { fieldId: 'dynamodb.aws.accessKeyId' },
    'dynamodb.aws.secretAccessKey': {
      fieldId: 'dynamodb.aws.secretAccessKey',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
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
        collapsed: true,
        label: 'Application details',
        fields: [
          'dynamodb.aws.accessKeyId',
          'dynamodb.aws.secretAccessKey',
        ],
      },
    ],
  },
};
