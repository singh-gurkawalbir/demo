export default {
  fieldMap: {
    name: { fieldId: 'name' },
    's3.accessKeyId': { fieldId: 's3.accessKeyId' },
    's3.secretAccessKey': { fieldId: 's3.secretAccessKey' },
    's3.pingBucket': { fieldId: 's3.pingBucket' },
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
          's3.accessKeyId', 's3.secretAccessKey', 's3.pingBucket'
        ],
      },
    ],
  },
};
