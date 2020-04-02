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
    },
    'http.unencrypted.api': {
      id: 'http.unencrypted.api',
      type: 'text',
      label: 'API key',
      required: true,
    },
    'http.encrypted.secret': {
      id: 'http.encrypted.secret',
      type: 'text',
      label: 'Secret',
      required: true,
      inputType: 'password',
      defaultValue: '',
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
