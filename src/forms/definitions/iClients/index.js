export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/provider'] = newValues['/oauth2/clientId']
      ? 'custom_oauth2'
      : 'amazonmws';

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'oauth2.clientId': { fieldId: 'oauth2.clientId' },
    'oauth2.clientSecret': { fieldId: 'oauth2.clientSecret' },
    'amazonmws.accessKeyId': { fieldId: 'amazonmws.accessKeyId' },
    'amazonmws.secretKey': { fieldId: 'amazonmws.secretKey' },
  },
  layout: {
    fields: [
      'name',
      'oauth2.clientId',
      'oauth2.clientSecret',
      'amazonmws.accessKeyId',
      'amazonmws.secretKey',
    ],
  },
};
