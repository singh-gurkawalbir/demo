export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/wp-json/wc/v1/orders',
    '/type': 'rest',
    '/assistant': 'woocommerce',
    '/rest/pingMethod': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'Consumer Key:',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'connection.rest.basicAuth.password',
      inputType: 'password',
      label: 'Consumer Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
