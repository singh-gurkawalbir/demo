export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'shipstation',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'carriers',
    '/rest/baseURI': `https://ssapi.shipstation.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key',
      helpText: 'The API Key of your ShipStation account.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The API Secret of your ShipStation account.',
      label: 'API Secret:',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
