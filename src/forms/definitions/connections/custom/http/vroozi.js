export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'vroozi',
    '/http/auth/type': 'token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': ' ',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/accountType'] === 'sandbox' ? 'sandbox-' : ''
    }api.vroozi.com/v1`,
    '/http/ping/relativeURI': '/company-codes',
    '/http/ping/method': 'GET',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
    '/http/headers': [
      {
        name: 'x-api-key',
        value: '{{{connection.http.unencrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account Type',
      required: true,
      helpText:
        'Please select your account type here. Select Sandbox if your API Endpoint starts with https://sandbox-api.vroozi.com. Select Production if your API Endpoint starts with https://api.vroozi.com',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return 'production';
          }
        }

        return 'sandbox';
      },
    },
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      type: 'text',
      label: 'API Key',
      required: true,
      helpText:
        'Please enter your API Key here.API key is generated after creating your application.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Access Token',
      helpText:
        'Please enter your Access Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. To get an API key for your Vroozi account,login to your Vroozi account and Under API Integration section, click on Credentials.Create your application by clicking on "Add New Application" After entering your application name, you will be provided with an access token which is shown only once.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'accountType',
      'http.unencrypted.apiKey',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
