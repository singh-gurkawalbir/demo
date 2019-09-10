export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'snapfulfil',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'api/Receipts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.snapfulfil.net/`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      id: 'http.subdomain',
      helpText:
        "Enter your Snapfulfil subdomain. For example, in https://syndemo-eapi.snapfulfil.net/ 'syndemo-eapi' is the subdomain.",
      startAdornment: 'https://',
      endAdornment: '.snapfulfil.net/',
      label: 'Subdomain',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.snapfulfil.net/')
          );

        return subdomain;
      },
    },
    {
      fieldId: 'http.auth.basic.username',
      helpText: `Please enter your snapfulfil account's username`,
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: `Please enter your snapfulfil account's password`,
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
