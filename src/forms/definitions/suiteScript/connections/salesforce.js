export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

    if (newValues['/salesforce/oauth2FlowType'] === 'refreshToken') {
      newValues['/salesforce/username'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name', required: true },
    'salesforce.username': { fieldId: 'salesforce.username' },
    'salesforce.password': { fieldId: 'salesforce.password' },
    'salesforce.securityKey': { fieldId: 'salesforce.securityKey' },
    'salesforce.sandbox': { fieldId: 'salesforce.sandbox' },
  },
  layout: {
    fields: [
      'name',
      'salesforce.username',
      'salesforce.password',
      'salesforce.securityKey',
      'salesforce.sandbox',
    ],
    type: 'collapse',
  },
};
