export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'mailgun',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/domains',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.mailgun.net/v3`,
    '/rest/basicAuth/username': 'api',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.password',
      label: 'API Key',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
