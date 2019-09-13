export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'jobvite',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '-stg' : ''
    }.jobvite.com`,
    '/http/ping/relativeURI':
      '/api/v2/candidate?api={{connection.http.unencrypted.api}}&sc={{connection.http.encrypted.secret}}',
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      type: 'select',
      label: 'Environment',
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
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('api-stg.') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    {
      id: 'http.unencrypted.companyId',
      type: 'text',
      label: 'Company Id',
      required: true,
      helpText: 'The company ID of your Jobvite account.',
    },
    {
      id: 'http.unencrypted.api',
      type: 'text',
      label: 'API key',
      required: true,
      helpText: 'The API Key of your Jobvite account.',
    },
    {
      id: 'http.encrypted.secret',
      type: 'text',
      label: 'Secret',
      required: true,
      inputType: 'password',
      helpText: 'The Secret Key of your Jobvite account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
