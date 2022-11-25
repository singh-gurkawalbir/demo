export default {
  preSave: formValues => {
    const pingData = {
      type: 'get',
      credentials: {
        partnerUserID: formValues['/http/unencrypted/partnerUserId'],
        partnerUserSecret: formValues['/http/encrypted/partnerUserSecret'],
      },
      inputSettings: { type: 'policyList', adminOnly: true },
    };
    const pingBody = {};

    pingBody.requestJobDescription = JSON.stringify(pingData);

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'expensify',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'urlencoded',
      '/http/ping/relativeURI': '/ExpensifyIntegrations',
      '/http/baseURI': 'https://integrations.expensify.com/Integration-Server',
      '/http/ping/method': 'POST',
      '/http/ping/successPath': 'responseCode',
      '/http/ping/successValues': [200],
      '/http/ping/body': JSON.stringify(pingBody),
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.partnerUserId': {
      id: 'http.unencrypted.partnerUserId',
      type: 'text',
      label: 'Partner user id',
      helpKey: 'expensify.connection.http.unencrypted.partnerUserId',
      required: true,
    },
    'http.encrypted.partnerUserSecret': {
      id: 'http.encrypted.partnerUserSecret',
      type: 'text',
      inputType: 'password',
      label: 'Partner user secret',
      required: true,
      helpKey: 'expensify.connection.http.encrypted.partnerUserSecret',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
