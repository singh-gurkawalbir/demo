export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'accelo',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com`,
    '/http/ping/relativeURI': '/api/v0/companies',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/authURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/token`,
    '/http/auth/oauth/scopeDelimiter': ',',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.acceloSubdomain': {
      id: 'http.acceloSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api.accelo.com',
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
            baseUri.indexOf('.api.accelo.com')
          );

        return subdomain;
      },
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['read(all)', 'write(all)'],
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
      { collapsed: true, label: 'Application details', fields: ['http.acceloSubdomain', 'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
