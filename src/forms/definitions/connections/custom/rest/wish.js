export default {
  preSubmit: formValues => {
    const environment = 'production';

    return {
      ...formValues,
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
      '/type': 'rest',
      '/assistant': 'wish',
      '/rest/oauth/accessTokenPath': 'data.access_token',
      '/rest/refreshTokenPath': 'data.refresh_token',
    };
  },
  fields: [{ fieldId: 'name' }],
};
