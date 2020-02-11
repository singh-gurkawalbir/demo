export default {
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    'dynamodb.aws.accessKeyId': { fieldId: 'dynamodb.aws.accessKeyId' },
    'dynamodb.aws.secretAccessKey': {
      fieldId: 'dynamodb.aws.secretAccessKey',
    },
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'dynamodb.aws.accessKeyId',
      'dynamodb.aws.secretAccessKey',
    ],
  },
};
