export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'chargebee',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/basicAuth/password': '',
    '/rest/pingRelativeURI': '/v2/subscriptions',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://${
      formValues['/chargebeeSubdomain']
    }.chargebee.com/api`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      id: 'chargebeeSubdomain',
      startAdornment: 'https://',
      helpText:
        "Enter your Chargebee subdomain. For example, in https://mycompany.chargebee.com/api 'mycompany' is the subdomain.",
      endAdornment: '.chargebee.com/api',
      label: 'Subdomain',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.chargebee.com/api')
          );

        return subdomain;
      },
    },
    {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpText: 'The API Key of your Chargebee account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
