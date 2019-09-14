export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'accelo',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${
      formValues['/rest/acceloSubdomain']
    }.api.accelo.com`,
    '/rest/authURI': `https://${
      formValues['/rest/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/authorize`,
    '/rest/oauthTokenURI': `https://${
      formValues['/rest/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/token`,
    '/rest/scopeDelimiter': ',',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.acceloSubdomain': {
      id: 'rest.acceloSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api.accelo.com',
      label: 'Subdomain:',
      helpText:
        'Please enter your subdomain here which you configured in Deployment Information page while signing up for your new Accelo account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.api.accelo.com')
          );

        return subdomain;
      },
    },
    'rest.scope': {
      fieldId: 'rest.scope',
      scopes: ['read(all)', 'write(all)'],
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.acceloSubdomain', 'rest.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
