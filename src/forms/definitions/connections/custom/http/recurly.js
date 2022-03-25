export default {
  preSave: formValues => {
    const newValues = {...formValues};

    if (newValues['/http/unencrypted/version'] === 'v3') {
      newValues['/http/baseURI'] = 'https://v3.recurly.com';
      newValues['/http/ping/relativeURI'] = '/accounts';
      newValues['/http/headers'] = [
        {
          name: 'Accept',
          value: 'application/vnd.recurly.v2021-02-25+json',
        },
      ];
    } else {
      newValues['/http/baseURI'] = `https://${formValues['/recurlySubdomain']}.recurly.com`;
      newValues['/http/ping/relativeURI'] = '/v2/accounts';
      newValues['/http/headers'] = undefined;
    }

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'recurly',
      '/http/auth/type': 'basic',
      '/http/mediaType': 'xml',
      '/http/auth/basic/password': '',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.version': {
      id: 'http.unencrypted.version',
      type: 'select',
      label: 'API versions',
      helpKey: 'recurly.connection.http.unencrypted.version',
      required: true,
      defaultValue: r => (r?.http?.unencrypted?.version) || 'v2',
      options: [
        {
          items: [
            { label: 'v3', value: 'v3' },
            { label: 'v2', value: 'v2' },
          ],
        },
      ],
    },
    recurlySubdomain: {
      id: 'recurlySubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.recurly.com',
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
            baseUri.indexOf('.recurly.com')
          );

        return subdomain;
      },
      visibleWhen: [{field: 'http.unencrypted.version', is: ['v2']}],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'recurly.connection.http.auth.basic.username',
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
        fields: ['http.unencrypted.version', 'recurlySubdomain', 'http.auth.basic.username'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
