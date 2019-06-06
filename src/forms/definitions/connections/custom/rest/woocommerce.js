export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/wp-json/wc/v1/orders',
      '/type': 'rest',
      '/assistant': 'woocommerce',
      '/rest/pingMethod': 'GET',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      id: 'Username',
      name: '/rest/basicAuth/username',
      helpKey: 'connection.rest.basicAuth.username',
      type: 'text',
      label: 'Consumer Key:',
      defaultValue: r =>
        r && r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
      required: true,
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      type: 'text',
      inputType: 'password',
      label: 'Consumer Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
