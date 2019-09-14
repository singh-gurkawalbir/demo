export default {
  preSubmit: formValues => {
    const environment = 'production';

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'wish',
      '/rest/authType': 'oauth',
      '/rest/mediaType': 'urlencoded',
      '/rest/authHeader': 'Authorization',
      '/rest/authScheme': 'Bearer',
      '/rest/baseURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/api/v2'
          : 'https://sandbox.merchant.wish.com/api/v2'
      }`,
      '/rest/authURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/oauth/authorize'
          : 'https://sandbox.merchant.wish.com/oauth/authorize'
      }`,
      '/rest/oauthTokenURI': `${
        environment === 'production'
          ? 'https://merchant.wish.com/api/v2/oauth/access_token'
          : 'https://sandbox.merchant.wish.com/api/v2/oauth/access_token'
      }`,
      '/rest/oauth/accessTokenPath': 'data.access_token',
      '/rest/refreshTokenPath': 'data.refresh_token',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
