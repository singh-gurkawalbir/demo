export default {
  preSubmit: formValues => {
    const headers = [
      {
        name: 'X-Site',
        value: '{{{connection.rest.encrypted.resourceOwnerId}}}',
      },
    ];

    return {
      ...formValues,
      '/rest/authType': 'oauth',
      '/rest/mediaType': 'json',
      '/type': 'rest',
      '/assistant': 'sageone',
      '/rest/baseURI':
        'https://api.columbus.sage.com/countryCode/sageone/accounts/v3/',
      '/rest/authURI': 'https://www.sageone.com/oauth2/auth/central',
      '/rest/oauthTokenURI': 'https://api.sageone.com/oauth2/token',
      '/rest/scopeDelimiter': ' ',
      '/rest/scope': ['full_access'],
      '/rest/headers': headers,
    };
  },
  fields: [{ fieldId: 'name' }],
};
