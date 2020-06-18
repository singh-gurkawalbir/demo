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
      helpKey: 'jobvite.connection.environment',
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
      label: 'Company ID',
      required: true,
      helpKey: 'jobvite.connection.http.unencrypted.companyId',
    },
    'http.unencrypted.api': {
      id: 'http.unencrypted.api',
      type: 'text',
      label: 'API key',
      required: true,
      helpKey: 'jobvite.connection.http.unencrypted.api',
    },
    'http.encrypted.secret': {
      id: 'http.encrypted.secret',
      type: 'text',
      label: 'Secret',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'jobvite.connection.http.encrypted.secret',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['environment',
          'http.unencrypted.companyId',
          'http.unencrypted.api',
          'http.encrypted.secret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
