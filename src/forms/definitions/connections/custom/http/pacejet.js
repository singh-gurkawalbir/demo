export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pacejet',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.pacejet.cc/',
    '/http/ping/relativeURI': '/Workstations',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'PacejetLocation',
        value: '{{connection.http.unencrypted.pacejetLocation}}',
      },
      {
        name: 'PacejetLicenseKey',
        value: '{{connection.http.encrypted.pacejetLicenseKey}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.pacejetLocation': {
      id: 'http.unencrypted.pacejetLocation',
      type: 'text',
      label: 'Pacejet location',
      required: true,
    },
    'http.encrypted.pacejetLicenseKey': {
      id: 'http.encrypted.pacejetLicenseKey',
      type: 'text',
      label: 'Pacejet license key',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.pacejetLocation',
      'http.encrypted.pacejetLicenseKey',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
