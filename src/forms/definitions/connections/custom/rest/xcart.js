export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'xcart',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': '_key',
    '/rest/pingRelativeURI': '/admin.php?target=RESTAPI&_path=product/1',
    '/rest/pingMethod': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      label: 'Base URI:',
    },
    {
      fieldId: 'rest.bearerToken',
      label: 'Token:',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
