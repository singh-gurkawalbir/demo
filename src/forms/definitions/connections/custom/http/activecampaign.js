export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'activecampaign',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI':
      '/admin/api.php?api_action=account_view&api_output=json',
    '/http/baseURI': `https://${
      formValues['/http/activecampaignSubdomain']
    }.api-us1.com`,
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'api_key',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.activecampaignSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api-us1.com',
      label: 'Subdomain:',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      helpText: 'Please enter your account subdomain here.',
      required: true,
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.api-us1.com')
          );

        return subdomain;
      },
    },
    {
      fieldId: 'http.auth.token.token',
      label: 'API Key:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and Developer subsection.',
      required: true,
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
