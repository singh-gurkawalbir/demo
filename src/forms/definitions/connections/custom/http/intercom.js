export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'outreach',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.intercom.io/`,
    '/http/auth/oauth/authURI': 'https://app.intercom.io/oauth',
    '/http/auth/oauth/tokenURI': 'https://api.intercom.io/auth/eagle/token',
  }),
  fields: [{ fieldId: 'name' }],
};
