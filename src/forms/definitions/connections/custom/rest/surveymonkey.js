export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'surveymonkey',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.surveymonkey.net',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.surveymonkey.net/oauth/authorize',
    '/rest/oauthTokenURI': 'https://api.surveymonkey.net/oauth/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/pingRelativeURI': '/v3/users/me',
    '/rest/pingMethod': 'GET',
  }),
  fields: [{ fieldId: 'name' }],
};
