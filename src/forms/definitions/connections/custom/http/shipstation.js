export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipstation',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'carriers',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://ssapi.shipstation.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpText: 'The API Key of your ShipStation account.',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The API Secret of your ShipStation account.',
      label: 'API Secret',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
