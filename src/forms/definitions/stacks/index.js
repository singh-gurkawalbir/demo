export default {
  fieldMap: {
    name: { fieldId: 'name' },
    type: { fieldId: 'type' },
    'server.hostURI': { fieldId: 'server.hostURI' },
    'lambda.accessKeyId': { fieldId: 'lambda.accessKeyId' },
    'lambda.secretAccessKey': { fieldId: 'lambda.secretAccessKey' },
    'lambda.awsRegion': { fieldId: 'lambda.awsRegion' },
    'lambda.functionName': { fieldId: 'lambda.functionName' },
  },
  layout: {
    fields: [
      'name',
      'type',
      'server.hostURI',
      'lambda.accessKeyId',
      'lambda.secretAccessKey',
      'lambda.awsRegion',
      'lambda.functionName',
    ],
  },
};
