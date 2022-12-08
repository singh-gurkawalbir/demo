export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'clover',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? 'sandbox.dev.clover.com' : `${
        formValues['/http/unencrypted/region'] === 'usandcanada' ? '.clover.com' : '.eu.clover.com'}`
    }`,
    '/http/ping/relativeURI': `/v3/merchants/${
      formValues['/http/unencrypted/merchantId']}`,
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI': `https://${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? 'sandbox.dev.clover.com' : `${
        formValues['/http/unencrypted/region'] === 'usandcanada' ? 'www.clover.com' : 'eu.clover.com'}`
    }/oauth/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? 'sandbox.dev.clover.com' : `${
        formValues['/http/unencrypted/region'] === 'usandcanada' ? 'www.clover.com' : 'eu.clover.com'}`
    }/oauth/token`,
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.environment': {
      id: 'http.unencrypted.environment',
      type: 'select',
      label: 'Environment',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpKey: 'clover.connection.http.unencrypted.environment',
    },
    'http.unencrypted.region': {
      id: 'http.unencrypted.region',
      type: 'select',
      label: 'Region',
      helpKey: 'clover.connection.http.unencrypted.region',
      required: true,
      options: [
        {
          items: [
            { label: 'US & Canada', value: 'usandcanada' },
            { label: 'EU', value: 'eu' },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'http.unencrypted.environment',
          is: ['production'],
        },
      ],
    },
    'http.unencrypted.merchantId': {
      id: 'http.unencrypted.merchantId',
      type: 'text',
      label: 'Merchant ID',
      required: true,
      helpKey: 'clover.connection.http.unencrypted.merchantId',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.environment', 'http.unencrypted.region', 'http.unencrypted.merchantId', 'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

