export default {
  preSave: formValues => ({
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
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'api_key',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.activecampaignSubdomain': {
      id: 'http.activecampaignSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api-us1.com',
      label: 'Subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
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
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'activecampaign.connection.http.auth.token.token',
      label: 'API key',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Application details', fields: ['http.activecampaignSubdomain', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
