export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'prestashop',
      '/http/auth/type': 'custom',
      '/http/baseURI': `http://${formValues['/storeURL']}`,
      '/http/mediaType': 'xml',
      '/http/ping/relativeURI': '/api/customers',
      '/http/ping/method': 'GET',
      '/http/successMediaType': 'json',
      '/http/headers': [
        {
          name: 'Authorization',
          value:
                'Basic {{{base64Encode (join ":" connection.http.encrypted.apiKey "")}}}',
        },
        {
          name: 'Io-Format',
          value: 'JSON',
        },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    storeURL: {
      id: 'storeURL',
      startAdornment: 'http://',
      type: 'text',
      label: 'Store URL',
      required: true,
      helpKey: 'prestashop.connection.storeURL',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
            baseUri && baseUri.substring(baseUri.indexOf('http://') + 7);

        return subdomain;
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API key',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'prestashop.connection.http.encrypted.apiKey',
    },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      isLoggable: true,
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
      removeWhen: [{ field: 'mode', is: ['cloud'] }],
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'mode', '_agentId'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['storeURL', 'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
