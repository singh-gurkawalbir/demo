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
    { fieldId: 'rest.baseURI', helpKey: 'woocommerce.baseURI' },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'Consumer Key:',
      helpKey: 'woocommerce.username',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'woocommerce.password',
      inputType: 'password',
      label: 'Consumer Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
