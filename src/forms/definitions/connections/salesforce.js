export default {
  preSave: formValues => {
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
    'salesforce.flowType': {
      id: 'salesforce.flowType',
      type: 'text',
      visible: false,
      defaultValue: r => {
        if (!(r && r.salesforce && r.salesforce.oauth2FlowType)) {
          return 'false';
        }

        return 'true';
      },
    },
    'salesforce.info.email': {
      id: 'salesforce.info.email',
      type: 'text',
      label: 'Email',
      defaultDisabled: true,
      helpText: 'Your Salesforce account email.',
      defaultValue: r =>
        r && r.salesforce && r.salesforce.info && r.salesforce.info.email,
      visibleWhenAll: [
        { field: 'salesforce.oauth2FlowType', isNot: [''] },
        { field: 'salesforce.flowType', is: ['true'] },
      ],
    },
    'salesforce.info.organization_id': {
      id: 'salesforce.info.organization_id',
      type: 'text',
      label: 'Organization id',
      defaultDisabled: true,
      helpText: "Your organization's unique Salesforce ID",
      defaultValue: r =>
        r &&
        r.salesforce &&
        r.salesforce.info &&
        r.salesforce.info.organization_id,
      visibleWhenAll: [
        { field: 'salesforce.oauth2FlowType', isNot: [''] },
        { field: 'salesforce.flowType', is: ['true'] },
      ],
    },
    'salesforce.username': { fieldId: 'salesforce.username' },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'salesforce.concurrencyLevel': { fieldId: 'salesforce.concurrencyLevel' },
  },
  layout: {
    fields: [
      'name',
      'salesforce.flowType',
      'salesforce.info.email',
      'salesforce.info.organization_id',
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
