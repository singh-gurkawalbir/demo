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
  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
