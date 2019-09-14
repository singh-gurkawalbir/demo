export default {
  preSubmit: formValues => {
    const newValues = Object.assign({}, formValues);

    if (newValues['/salesforce/oauth2FlowType'] === 'refreshToken') {
      newValues['/salesforce/username'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name', required: true },
    'salesforce.sandbox': { fieldId: 'salesforce.sandbox' },
    'salesforce.oauth2FlowType': { fieldId: 'salesforce.oauth2FlowType' },
    'salesforce.username': { fieldId: 'salesforce.username' },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'salesforce.concurrencyLevel': { fieldId: 'salesforce.concurrencyLevel' },
  },
  layout: {
    fields: [
      'name',
      'salesforce.sandbox',
      'salesforce.oauth2FlowType',
      'salesforce.username',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'salesforce.concurrencyLevel',
        ],
      },
    ],
  },
};
