export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'spreecommerce',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/v1/zones',
    '/rest/baseURI': `${formValues['/rest/baseURI']}/api`,
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'X-Spree-Token',
    '/rest/authScheme': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      endAdornment: '/api',
      label: 'Base URI:',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/api'));

        return subdomain;
      },
    },
    {
      fieldId: 'rest.bearerToken',
      required: true,
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
