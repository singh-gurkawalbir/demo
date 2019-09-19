export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailgun',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/domains',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.mailgun.net/v3`,
    '/http/auth/basic/username': 'api',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.password',
      label: 'API Key',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
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
