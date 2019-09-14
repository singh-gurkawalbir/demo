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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.baseURI': {
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
    'rest.bearerToken': { fieldId: 'rest.bearerToken', required: true },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.baseURI', 'rest.bearerToken'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
