export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'jobvite',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '-stg' : ''
    }.jobvite.com`,
    '/rest/pingRelativeURI':
      '/api/v2/candidate?api={{connection.rest.unencrypted.api}}&sc={{connection.rest.encrypted.sc}}',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      type: 'select',
      label: 'Environment:',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpText:
        'Select either Production or Sandbox based on your requirement.',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('api-stg.') !== -1) {
            return 'sandbox';
          }

          return 'production';
        }

        return 'production';
      },
    },
    {
      id: 'rest.unencrypted.companyId',
      type: 'text',
      label: 'Company Id:',
      required: true,
      helpText: 'The company ID of your Jobvite account.',
    },
    {
      id: 'rest.unencrypted.api',
      type: 'text',
      label: 'API key:',
      required: true,
      helpText: 'The API Key of your Jobvite account.',
    },
    {
      id: 'rest.encrypted.sc',
      type: 'text',
      label: 'Secret:',
      required: true,
      inputType: 'password',
      helpText: 'The Secret Key of your Jobvite account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
