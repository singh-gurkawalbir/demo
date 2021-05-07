export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'walmartcanada',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://marketplace.walmartapis.com/v3',
    '/http/ping/relativeURI': '/ca/feeds',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'WM_SVC.NAME',
        value: 'Walmart Marketplace',
      },
      {
        name: 'WM_QOS.CORRELATION_ID',
        value: "{{{dateFormat 'X'}}}",
      },
      {
        name: 'WM_SEC.TIMESTAMP',
        value: "{{{dateFormat 'X'}}}",
      },
      {
        name: 'WM_CONSUMER.CHANNEL.TYPE',
        value: '511b6430-8bb3-475c-97e2-3bb5ed066780',
      },
      {
        name: 'WM_CONSUMER.ID',
        value: '{{{connection.http.unencrypted.consumerId}}}',
      },
      {
        name: 'WM_TENANT_ID',
        value: 'WALMART.CA',
      },
      {
        name: 'WM_LOCALE_ID',
        value: '{{{connection.http.unencrypted.localeId}}}',
      },
      {
        name: 'Accept',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.consumerId': {
      id: 'http.unencrypted.consumerId',
      type: 'text',
      label: 'Consumer ID',
      helpKey: 'walmartcanada.connection.http.unencrypted.consumerId',
      required: true,
    },
    'http.unencrypted.localeId': {
      id: 'http.unencrypted.localeId',
      type: 'select',
      label: 'Locale ID',
      helpKey: 'walmartcanada.connection.http.unencrypted.localeId',
      required: true,
      defaultValue: r =>
        (r?.http?.unencrypted?.localeId) ||
        'en_CA',
      options: [
        {
          items: [
            { label: 'en_CA', value: 'en_CA' },
            { label: 'fr_CA', value: 'fr_CA' },
          ],
        },
      ],
    },
    'http.encrypted.consumerKey': {
      id: 'http.encrypted.consumerKey',
      type: 'text',
      label: 'Private key',
      helpKey: 'walmartcanada.connection.http.encrypted.consumerKey',
      required: true,
      inputType: 'password',
      defaultValue: '',
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
        fields: [
          'http.unencrypted.consumerId',
          'http.encrypted.consumerKey',
          'http.unencrypted.localeId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
