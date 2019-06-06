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
      type: 'text',
      fieldId: 'http.activecampaignSubdomain',
      startAdornment: 'https://',
      endAdornment: '.api-us1.com',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      helpKey: 'connection.http.activecampaignSubdomain',
      defaultValue: r => {
        const baseUri = r.http.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.api-us1.com')
        );

        return subdomain;
      },
    },
    {
      name: '/http/auth/token/token',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      helpKey: 'connection.http.activecampaignToken',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
