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
      helpKey:
        'Please enter your partner user id of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/.',
      required: true,
    },
    'http.encrypted.partnerUserSecret': {
      id: 'http.encrypted.partnerUserSecret',
      type: 'text',
      inputType: 'password',
      label: 'Partner user secret',
      required: true,
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
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
