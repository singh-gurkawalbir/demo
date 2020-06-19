export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'bamboohr',
    '/http/auth/type': 'custom',
    '/http/baseURI': `https://api.bamboohr.com/api/gateway.php/${
      formValues['/http/bamboohrSubdomain']
    }`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/employees/directory',
    '/http/ping/method': 'GET',
    '/http/headers': [
      { name: 'Accept', value: 'application/json' },
      {
        name: 'Authorization',
        value:
          'Basic {{{base64Encode (join ":" connection.http.encrypted.apiKey "x")}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.bamboohrSubdomain': {
      id: 'http.bamboohrSubdomain',
      type: 'text',
      required: true,
      label: 'Subdomain',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        let value = '';

        if (
          r &&
          r.http &&
          r.http.baseURI &&
          r.http.baseURI.indexOf(
            'https://api.bamboohr.com/api/gateway.php/'
          ) !== -1
        ) {
          value = r.http.baseURI.replace(
            'https://api.bamboohr.com/api/gateway.php/',
            ''
          );
        }

        return value;
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API key',
      type: 'text',
      inputType: 'password',
      helpKey: 'bamboohr.connection.http.encrypted.apiKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
        fields: ['http.bamboohrSubdomain', 'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
