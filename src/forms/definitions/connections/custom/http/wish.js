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
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
