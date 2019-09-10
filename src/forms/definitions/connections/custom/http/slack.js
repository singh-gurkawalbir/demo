export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'slack',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://slack.com/api`,
    '/http/ping/relativeURI': 'api.test',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'token',
    '/http/ping/successPath': 'ok',
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      required: true,
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
