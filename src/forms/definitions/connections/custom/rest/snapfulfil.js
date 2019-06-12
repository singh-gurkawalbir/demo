export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'snapfulfil',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'api/Receipts',
    '/rest/baseURI': `https://${formValues['/rest/subdomain']}.snapfulfil.net/`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      fieldId: 'rest.subdomain',
      helpText:
        "Enter your Snapfulfil subdomain. For example, in https://syndemo-eapi.snapfulfil.net/ 'syndemo-eapi' is the subdomain.",
      startAdornment: 'https://',
      endAdornment: '.snapfulfil.net/',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.snapfulfil.net/')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
