export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'integrationApp',
    };

    try {
      newValues['/opts'] = JSON.parse(newValues['/opts']);
    } catch (e) {
      return newValues;
    }

    return newValues;
  },
  fieldMap: {
    email: { fieldId: 'email' },
    _editionId: { fieldId: '_editionId' },
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
        fields: ['email', '_editionId', 'expires', 'trialEndDate', 'sandbox', 'opts'],
      },
      {
        collapsed: true,
        label: 'Child licenses',
        fields: ['childLicenses'],
      },
    ],
  },
};
