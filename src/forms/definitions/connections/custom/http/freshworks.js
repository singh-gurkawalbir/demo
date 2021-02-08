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
    }.${formValues['/domain'] === 'myfreshworks' ? 'myfreshworks' : 'freshworks'}.com/crm/sales`,
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
    domain: {
      id: 'domain',
      type: 'select',
      label: 'Domain',
      required: true,
      helpKey: 'freshworks.connection.domain',
      options: [
        {
          items: [
            { label: 'myfreshworks', value: 'myfreshworks' },
            { label: 'freshworks', value: 'freshworks' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('myfreshworks') === -1) {
            return 'freshworks';
          }

          return 'myfreshworks';
        }
      },
    },
    'http.freshworksSubdomain': {
      type: 'text',
      id: 'http.freshworksSubdomain',
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

        if (baseUri) {
          if (baseUri.indexOf('.freshworks.com') === -1) {
            const subdomainMyfreshwork =
              baseUri.substring(
                baseUri.indexOf('https://') + 8,
                baseUri.indexOf('.myfreshworks.com'));

            return subdomainMyfreshwork;
          }
          const subdomain =
              baseUri.substring(
                baseUri.indexOf('https://') + 8,
                baseUri.indexOf('.freshworks.com'));

          return subdomain;
        }
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
          'domain',
          'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
