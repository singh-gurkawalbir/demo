export default {
  preSubmit: formValues => {
    const newValues = Object.assign({}, formValues);

    if (newValues['/salesforce/oauth2FlowType'] === 'refreshToken') {
      newValues['/salesforce/username'] = undefined;
    }

    return newValues;
  },
  fields: [
    { fieldId: 'type', required: true },
    { fieldId: 'name', required: true },
    { fieldId: 'salesforce.sandbox' },
    { fieldId: 'salesforce.oauth2FlowType' },
    { fieldId: 'salesforce.username' },
  ],

  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { fieldId: '_borrowConcurrencyFromConnectionId' },
        { fieldId: 'salesforce.concurrencyLevel' },
      ],
    },
  ],
};
