export default {
  fieldMap: {
    email: { fieldId: 'email' },
    expires: { fieldId: 'expires' },
    trialEndDate: { fieldId: 'trialEndDate' },
    sandbox: { fieldId: 'sandbox' },
    opts: { fieldId: 'opts' },
  },

  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['email', 'trialEndDate', 'expires', 'sandbox', 'opts'],
      },
    ],
  },
};
