export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'netsuite.authType': { fieldId: 'netsuite.authType' },
    'netsuite.role': { fieldId: 'netsuite.role' },
    'netsuite.email': { fieldId: 'netsuite.email' },
    'netsuite.password': { fieldId: 'netsuite.password' },
    'netsuite.consumerKey': { fieldId: 'netsuite.consumerKey' },
    'netsuite.consumerSecret': { fieldId: 'netsuite.consumerSecret' },
    'netsuite.tokenId': { fieldId: 'netsuite.tokenId' },
    'netsuite.tokenSecret': { fieldId: 'netsuite.tokenSecret' },
  },
  layout: {
    fields: [
      'name',
      'netsuite.authType',
      'netsuite.role',
      'netsuite.email',
      'netsuite.password',
      'netsuite.consumerKey',
      'netsuite.consumerSecret',
      'netsuite.tokenId',
      'netsuite.tokenSecret',
    ],
    type: 'collapse',
  },
};
