export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'splunk',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/',
    '/http/ping/method': 'GET',
    '/http/disableStrictSSL': true,
  }),
  fields: [
    { fieldId: 'name' },
    { fieldId: 'http.baseURI' },
    {
      fieldId: 'http.auth.basic.username',
    },
    {
      fieldId: 'http.auth.basic.password',
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
