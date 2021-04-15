export default {
  preSave: formValues => {
    const newValues = formValues;

    try {
      newValues['/opts'] = JSON.parse(newValues['/opts']);
    } catch (e) {
      return newValues;
    }

    return newValues;
  },
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
