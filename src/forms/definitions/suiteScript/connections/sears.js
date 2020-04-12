export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

    if (newValues['/salesforce/oauth2FlowType'] === 'refreshToken') {
      newValues['/salesforce/username'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'sears.sellerId': { fieldId: 'sears.sellerId' },
    'sears.username': { fieldId: 'sears.username' },
    'sears.password': { fieldId: 'sears.password' },
  },
  layout: {
    fields: ['name', 'sears.sellerId', 'sears.username', 'sears.password'],
    type: 'collapse',
  },
};
