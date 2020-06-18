export default {
  preSave: formValues => {
    const environment = 'production';

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'wish',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'urlencoded',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/baseURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/api/v2'
          : 'https://sandbox.merchant.wish.com/api/v2'
      }`,
      '/http/auth/oauth/authURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/oauth/authorize'
          : 'https://sandbox.merchant.wish.com/oauth/authorize'
      }`,
      '/http/auth/oauth/tokenURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/api/v2/oauth/access_token'
          : 'https://sandbox.merchant.wish.com/api/v2/oauth/access_token'
      }`,
      '/http/auth/oauth/accessTokenPath': 'data.access_token',
      '/http/auth/token/refreshTokenPath': 'data.refresh_token',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
