export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API Key',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpText:
        'To create an API key, In RetailOps, go to Administration > User Manager. Select your user account. In the bottom-right of the User Details pane, press the [Add API Key] button. Your API key will appear in a separate window. Copy the API key from there. Please note: For security purposes, when the API key appears in its separate window, this will be your only opportunity to view/copy the entire API key. Once you close the window, you will not be able to view the entire API key again (a truncated version appears under the Credentials pane to indicate that an API key was created previously). Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
