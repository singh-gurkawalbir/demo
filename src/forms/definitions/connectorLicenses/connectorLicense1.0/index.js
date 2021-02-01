export default {
  fieldMap: {
    email: { fieldId: 'email' },
    expires: { fieldId: 'expires' },
    sandbox: { fieldId: 'sandbox' },
    opts: { fieldId: 'opts' },
  },

  layout: {
    type: 'box',
    containers: [
      {
        fields: ['email', 'expires', 'sandbox', 'opts'],
      },
    ],
  },
};
