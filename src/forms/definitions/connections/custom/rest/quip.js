export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'quip',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://platform.quip.com`,
    '/rest/pingRelativeURI': '/1/threads/recent',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.bearerToken',
      label: 'API Access Token:',
      required: true,
      helpText: 'Please enter your API token here.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
