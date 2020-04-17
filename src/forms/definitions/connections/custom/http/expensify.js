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
      label: 'Partner User ID',
      helpKey:
        'Please enter your partner user id of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/.',
      required: true,
    },
    'http.encrypted.partnerUserSecret': {
      id: 'http.encrypted.partnerUserSecret',
      type: 'text',
      inputType: 'password',
      label: 'Partner User Secret',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.partnerUserId',
      'http.encrypted.partnerUserSecret',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
