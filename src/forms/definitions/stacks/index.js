export default {
  fieldMap: {
    name: { fieldId: 'name' },
    type: { fieldId: 'type' },
    'server.hostURI': { fieldId: 'server.hostURI' },
    'lambda.accessKeyId': { fieldId: 'lambda.accessKeyId' },
    'lambda.secretAccessKey': { fieldId: 'lambda.secretAccessKey' },
    'lambda.awsRegion': { fieldId: 'lambda.awsRegion' },
    'lambda.functionName': { fieldId: 'lambda.functionName' },
    'lambda.language': { fieldId: 'lambda.language' },
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
      'lambda.language',
    ],
  },
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/type'] === 'server') {
      delete newValues['/lambda/accessKeyId'];
      delete newValues['/lambda/secretAccessKey'];
      delete newValues['/lambda/awsRegion'];
      delete newValues['/lambda/functionName'];
      delete newValues['/lambda/language'];
    } else {
      delete newValues['/server/hostURI'];
    }

    return newValues;
  },
};
