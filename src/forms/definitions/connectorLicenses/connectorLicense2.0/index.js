export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'integrationApp',
    };

    return newValues;
  },
  fieldMap: {
    email: { fieldId: 'email' },
    edition: { fieldId: 'edition' },
    trialEndDate: { fieldId: 'trialEndDate' },
    expires: { fieldId: 'expires' },
    sandbox: { fieldId: 'sandbox' },
    opts: { fieldId: 'opts' },
    childLicenses: { fieldId: 'childLicenses' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['email', 'edition', 'expires', 'trialEndDate', 'sandbox', 'opts'],
      },
      {
        collapsed: true,
        label: 'Child licenses',
        fields: ['childLicenses'],
      },
    ],
  },
};
