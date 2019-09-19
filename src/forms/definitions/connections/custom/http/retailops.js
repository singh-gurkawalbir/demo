export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'retailops',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.retailops.com`,
    '/http/ping/relativeURI': '/product/sku/get~1.json',
    '/http/ping/method': 'POST',
    '/http/ping/body': JSON.stringify({ sku_string: '1' }),
    '/http/ping/successPath': 'success',
    '/http/ping/successValues': '1',
    '/http/headers': [
      { name: 'content-type', value: 'application/json' },
      {
        name: 'apikey',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      label: 'API Key',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpText:
        'To create an API key, In RetailOps, go to Administration > User Manager. Select your user account. In the bottom-right of the User Details pane, press the [Add API Key] button. Your API key will appear in a separate window. Copy the API key from there. Please note: For security purposes, when the API key appears in its separate window, this will be your only opportunity to view/copy the entire API key. Once you close the window, you will not be able to view the entire API key again (a truncated version appears under the Credentials pane to indicate that an API key was created previously).',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
