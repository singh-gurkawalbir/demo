export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'anaplan',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '1/3/workspaces',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.anaplan.com/',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your Anaplan account.',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your Anaplan account.',
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
