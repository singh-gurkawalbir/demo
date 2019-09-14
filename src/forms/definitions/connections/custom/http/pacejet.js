export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pacejet',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.pacejet.cc/`,
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
  fields: [
    { fieldId: 'name' },

    {
      id: 'http.unencrypted.pacejetLocation',
      type: 'text',
      label: 'Pacejet Location',
      helpText: 'Please reach out to Pacejet support team for location header.',
      required: true,
    },
    {
      id: 'http.encrypted.pacejetLicenseKey',
      type: 'text',
      label: 'Pacejet License Key',
      helpText:
        'Please reach out to Pacejet support team for License key. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your License key safe.',
      required: true,
      inputType: 'password',
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
