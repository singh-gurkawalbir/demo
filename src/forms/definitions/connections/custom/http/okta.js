export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'okta',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/v1/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/unencrypted/oktaDomain']}`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'SSWS',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.oktaDomain': {
      id: 'http.unencrypted.oktaDomain',
      type: 'text',
      startAdornment: 'https://',
      label: 'Okta domain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Okta domain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
          );

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'okta.connection.http.auth.token.token',
      required: true,
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
        fields: ['http.unencrypted.oktaDomain', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
