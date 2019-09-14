export default {
  preSubmit: formValues => {
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
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.unencrypted.partnerUserId',
      type: 'text',
      label: 'Partner User ID',
      helpText:
        'Please enter your partner user id of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/.',
      required: true,
    },
    {
      id: 'http.encrypted.partnerUserSecret',
      type: 'text',
      inputType: 'password',
      label: 'Partner User Secret',
      helpText:
        'Please enter your partner user secret of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      required: true,
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
