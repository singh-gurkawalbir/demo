import { isNewId } from '../../../utils/resource';

export default {
  preSave: (formValues, res) => {
    const newValues = { ...formValues};

    newValues['/assistant'] = res && res.assistant;

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'salesforce.sandbox': { fieldId: 'salesforce.sandbox' },
    'salesforce.oauth2FlowType': { fieldId: 'salesforce.oauth2FlowType' },
    'salesforce.info.email': {
      id: 'salesforce.info.email',
      type: 'text',
      label: 'Email',
      defaultDisabled: true,
      helpKey: 'Your Salesforce account email.',
      visible: r => r && !isNewId(r._id),
      defaultValue: r =>
        r && r.salesforce && r.salesforce.info && r.salesforce.info.email,
    },
    'salesforce.info.organization_id': {
      id: 'salesforce.info.organization_id',
      type: 'text',
      label: 'Organization id',
      defaultDisabled: true,
      helpKey: "Your organization's unique Salesforce ID",
      visible: r => r && !isNewId(r._id),
      defaultValue: r =>
        r &&
        r.salesforce &&
        r.salesforce.info &&
        r.salesforce.info.organization_id,
    },
    'salesforce.username': { fieldId: 'salesforce.username', removeWhen: [{field: 'salesforce.oauth2FlowType', is: ['refreshToken'] }] },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'salesforce.concurrencyLevel': { fieldId: 'salesforce.concurrencyLevel' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'salesforce.info.email',
          'salesforce.info.organization_id',
          'salesforce.sandbox',
          'salesforce.oauth2FlowType',
          'salesforce.username',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'salesforce.concurrencyLevel',
        ],
      },
    ],
  },
};
