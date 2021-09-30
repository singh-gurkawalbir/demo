export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'freshworks',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/contacts/filters',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${
      formValues['/http/freshworksSubdomain']
    }.myfreshworks.com/crm/sales`,
    '/http/headers': [
      {
        name: 'Authorization',
        value: 'Token token={{{connection.http.encrypted.apiKey}}}',
      },
    ],
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.freshworksSubdomain': {
      type: 'text',
      id: 'http.freshworksSubdomain',
      label: 'Subdomain',
      startAdornment: 'https://',
      endAdornment: '.myfreshworks.com/crm/sales',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.myfreshworks.com')
          );

        return subdomain;
      },
      helpKey: 'freshworks.connection.http.freshworksSubdomain',
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API key',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'freshworks.connection.http.encrypted.apiKey',
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
        fields: ['http.freshworksSubdomain',
          'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
