export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftdynamics365financeandoperation',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.dynamics.com`,
    '/http/ping/relativeURI': '/data/CustomerGroups',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI':
        'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
        'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.subdomain': {
      type: 'text',
      id: 'http.subdomain',
      startAdornment: 'https://',
      endAdornment: '.dynamics.com',
      label: 'Subdomain',
      required: true,
      helpKey: 'microsoftdynamics365financeandoperation.connection.http.subdomain',
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
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.subdomain'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
