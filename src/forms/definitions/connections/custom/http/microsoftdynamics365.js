export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftdynamics365',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/baseURI': `https://${
      formValues['/http/microsoftDynamics365Subdomain']
    }.dynamics.com`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.microsoftDynamics365Subdomain': {
      id: 'http.microsoftDynamics365Subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.dynamics.com',
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
            baseUri.indexOf('.dynamics.com')
          );

        return subdomain;
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.microsoftDynamics365Subdomain'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
