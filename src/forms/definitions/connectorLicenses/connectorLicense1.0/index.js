export default {
  fieldMap: {
    email: { fieldId: 'email' },
    expires: { fieldId: 'expires' },
    sandbox: { fieldId: 'sandbox' },
    opts: { fieldId: 'opts' },
  },

  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['email', 'expires', 'sandbox', 'opts'],
      },
    ],
  },
};
