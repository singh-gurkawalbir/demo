export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'recharge',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': `customers`,
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.rechargeapps.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Recharge-Access-Token',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. Access to the API will need to be given by a member of the ReCharge team so reach out to their support team to enable this for you. Once this has been enabled for your store, you can go to Integrations and click on API tokens on the far right corner of your dashboard.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
