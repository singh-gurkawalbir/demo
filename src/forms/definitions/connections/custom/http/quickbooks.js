export default {
  preSave: formValues => {
    let baseURI = '';
    let scope = [];

    if (formValues['/http/quickbooksEnvironment'] === 'saapi') {
      baseURI = 'https://sandbox-quickbooks.api.intuit.com';
    } else if (formValues['/http/quickbooksEnvironment'] === 'spapi') {
      baseURI = 'https://sandbox.api.intuit.com';
    } else if (formValues['/http/quickbooksEnvironment'] === 'paapi') {
      baseURI = 'https://quickbooks.api.intuit.com';
    } else if (formValues['/http/quickbooksEnvironment'] === 'ppapi') {
      baseURI = 'https://api.intuit.com';
    }
    if (
      ['saapi', 'paapi'].indexOf(formValues['/http/quickbooksEnvironment']) > -1
    ) {
      scope = [
        'openid',
        'profile',
        'email',
        'phone',
        'address',
        'com.intuit.quickbooks.accounting',
      ];
    } else {
      scope = [
        'openid',
        'profile',
        'email',
        'phone',
        'address',
        'com.intuit.quickbooks.payment',
      ];
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'quickbooks',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/baseURI': baseURI,
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/ping/relativeURI': '/v3/company/{{connection.http.unencrypted.realmID}}/query?query=select * from CompanyInfo',
      '/http/ping/method': 'GET',
      '/http/auth/oauth/authURI': 'https://appcenter.intuit.com/connect/oauth2',
      '/http/auth/oauth/tokenURI':
        'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/auth/oauth/scope': scope,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.quickbooksEnvironment': {
      id: 'http.quickbooksEnvironment',
      type: 'select',
      label: 'Environment',
      options: [
        {
          items: [
            { label: 'Sandbox Accounting API', value: 'saapi' },
            { label: 'Sandbox Payment API', value: 'spapi' },
            { label: 'Production Accounting API', value: 'paapi' },
            { label: 'Production Payment API', value: 'ppapi' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          switch (baseUri) {
            case 'https://sandbox-quickbooks.api.intuit.com':
              return 'saapi';
            case 'https://sandbox.api.intuit.com':
              return 'spapi';
            case 'https://quickbooks.api.intuit.com':
              return 'paapi';
            case 'https://api.intuit.com':
              return 'ppapi';
            default:
              return 'paapi';
          }
        }

        return 'paapi';
      },
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'quickbooks.connection.http._iClientId',
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
        fields: ['http.quickbooksEnvironment', 'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
