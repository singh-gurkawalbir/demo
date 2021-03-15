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
    _editionId: { fieldId: '_editionId' },
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
        fields: ['email', '_editionId', 'expires', 'sandbox', 'opts'],
      },
      {
        collapsed: true,
        label: 'Child licenses',
        fields: ['childLicenses'],
      },
    ],
  },
};
