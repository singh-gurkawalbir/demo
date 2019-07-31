export default {
  preSubmit: formValues => {
    const pingData = {
      type: 'get',
      credentials: {
        partnerUserID: formValues['/rest/unencrypted/partnerUserId'],
        partnerUserSecret: formValues['/rest/encrypted/partnerUserSecret'],
      },
      inputSettings: { type: 'policyList', adminOnly: true },
    };
    const pingBody = {};

    pingBody.requestJobDescription = JSON.stringify(pingData);

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'expensify',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'urlencoded',
      '/rest/pingRelativeURI': '/ExpensifyIntegrations',
      '/rest/baseURI': `https://integrations.expensify.com/Integration-Server`,
      '/rest/pingMethod': 'POST',
      '/rest/pingSuccessPath': 'policyList',
      '/rest/pingBody': JSON.stringify(pingBody),
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.unencrypted.partnerUserId',
      type: 'text',
      label: 'Partner User ID:',
      helpText:
        'Please enter your partner user id of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/.',
      required: true,
    },
    {
      id: 'rest.encrypted.partnerUserSecret',
      type: 'text',
      inputType: 'password',
      label: 'Partner User Secret:',
      helpText:
        'Please enter your partner user secret of expenisfy account which can be obtained from  https://www.expensify.com/tools/integrations/ after creating Expensify account at https://www.expensify.com/. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
