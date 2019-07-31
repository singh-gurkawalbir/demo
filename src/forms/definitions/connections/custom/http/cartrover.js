export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'cartrover',
    '/http/auth/type': 'basic',
    '/http/baseURI': 'https://api.cartrover.com/',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '1/3/workspaces',
    '/http/ping/method': 'GET',
    '/http/ping/successPath': 'success_code',
    '/http/ping/successValues': ['true'],
    '/http/ping/errorPath': ['true'],
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      helpText:
        'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
    },

    {
      fieldId: 'http.auth.basic.password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. Navigate to Merchant view on left hand side and click on API keys section to find API Key.',
    },
    { fieldId: 'http.disableStrictSSL' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'http.concurrencyLevel' },
  ],
};
