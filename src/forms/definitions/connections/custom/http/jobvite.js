export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
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
    'http.unencrypted.companyId': {
      id: 'http.unencrypted.companyId',
      type: 'text',
      label: 'Company Id',
      required: true,
      helpText: 'The company ID of your Jobvite account.',
    },
    'http.unencrypted.api': {
      id: 'http.unencrypted.api',
      type: 'text',
      label: 'API key',
      required: true,
      helpText: 'The API Key of your Jobvite account.',
    },
    'http.encrypted.secret': {
      id: 'http.encrypted.secret',
      type: 'text',
      label: 'Secret',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpText:
        'The Secret Key of your Jobvite account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe. This can be obtained from the Settings section and user secret subsection.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'http.unencrypted.companyId',
      'http.unencrypted.api',
      'http.encrypted.secret',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
