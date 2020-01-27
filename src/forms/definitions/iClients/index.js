export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/provider'] = 'custom_oauth2';

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'oauth2.clientId': { fieldId: 'oauth2.clientId' },
    'oauth2.clientSecret': { fieldId: 'oauth2.clientSecret' },
  },
  layout: {
    fields: ['name', 'oauth2.clientId', 'oauth2.clientSecret'],
  },
};
