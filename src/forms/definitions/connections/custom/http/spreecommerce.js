export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'spreecommerce',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v1/zones',
    '/http/ping/method': 'GET',
    '/http/baseURI': `${formValues['/http/baseURI']}/api`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Spree-Token',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      endAdornment: '/api',
      label: 'Base URI',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/api'));

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.baseURI', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
