export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'retailops',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.retailops.com`,
    '/rest/pingRelativeURI': '/product/sku/get~1.json',
    '/rest/pingMethod': 'POST',
    '/rest/pingBody': JSON.stringify({ sku_string: '1' }),
    '/rest/headers': [
      { name: 'content-type', value: 'application/json' },
      {
        name: 'apikey',
        value: '{{{connection.rest.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.encrypted.apiKey': {
      id: 'rest.encrypted.apiKey',
      label: 'API Key:',
      required: true,
      type: 'text',
      inputType: 'password',
      helpText:
        'To create an API key, In RetailOps, go to Administration > User Manager. Select your user account. In the bottom-right of the User Details pane, press the [Add API Key] button. Your API key will appear in a separate window. Copy the API key from there. Please note: For security purposes, when the API key appears in its separate window, this will be your only opportunity to view/copy the entire API key. Once you close the window, you will not be able to view the entire API key again (a truncated version appears under the Credentials pane to indicate that an API key was created previously).',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
