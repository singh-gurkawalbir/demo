export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },
    {
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
    {
      fieldId: 'http.auth.token.token',
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
