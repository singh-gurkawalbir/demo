export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'practicepanther',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://app.practicepanther.com/`,
    '/http/auth/oauth/authURI':
      'https://app.practicepanther.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://app.practicepanther.com/oauth/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
  }),
  fields: [{ fieldId: 'name' }],
};
