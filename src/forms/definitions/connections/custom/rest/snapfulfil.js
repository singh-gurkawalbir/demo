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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.subdomain': {
      type: 'text',
      id: 'rest.subdomain',
      helpText:
        "Enter your Snapfulfil subdomain. For example, in https://syndemo-eapi.snapfulfil.net/ 'syndemo-eapi' is the subdomain.",
      startAdornment: 'https://',
      endAdornment: '.snapfulfil.net/',
      label: 'Subdomain:',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.snapfulfil.net/')
          );

        return subdomain;
      },
    },
    'rest.basicAuth.username': { fieldId: 'rest.basicAuth.username' },
    'rest.basicAuth.password': { fieldId: 'rest.basicAuth.password' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.subdomain',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
