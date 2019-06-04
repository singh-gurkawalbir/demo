export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'zendesk',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/api/v2/users.json',
      '/rest/baseURI': `https://${
        formValues['/zendesk/subdomain']
      }.zendesk.com`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'zendesk.subdomain',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.zendesk.com')
        );

        return subdomain;
      },
    },
    { fieldId: 'rest.basicAuth.username' },
    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
