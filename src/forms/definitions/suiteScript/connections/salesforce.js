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
  },
  layout: {
    fields: ['name', 'salesforce.username'],
    type: 'collapse',
  },
};
