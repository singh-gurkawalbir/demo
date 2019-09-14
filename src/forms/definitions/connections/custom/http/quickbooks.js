export default {
  preSubmit: formValues => {
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
      label: 'Environment:',
      helpText:
        'Please select your environment here. Select Sandbox Accounting if the account is created on https://sandbox-quickbooks.api.intuit.com. Select Sandbox Payment if the account is created on https://sandbox.api.intuit.com. Select Production Accounting if the account is created on https://quickbooks.api.intuit.com. Select Production Payment if the account is created on https://api.intuit.com.',
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.quickbooksEnvironment'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
