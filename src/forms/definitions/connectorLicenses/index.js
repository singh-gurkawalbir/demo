export default {
  fieldMap: {
    email: { fieldId: 'email' },
    opts: { fieldId: 'opts' },
    expires: { fieldId: 'expires' },
    sandbox: { fieldId: 'sandbox' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: ['email', 'opts', 'expires', 'sandbox'],
      },
    ],
  },
};
