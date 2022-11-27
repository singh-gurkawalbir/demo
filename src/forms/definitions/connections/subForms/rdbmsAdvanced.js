export default {
  fieldMap: {
    'rdbms.options': {
      fieldId: 'rdbms.options',
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
    autoRecoverGovernanceErrors: {
      fieldId: 'autoRecoverGovernanceErrors',
    },
  },
  layout: {
    fields: [
      'rdbms.options',
      '_borrowConcurrencyFromConnectionId',
      'rdbms.concurrencyLevel',
      'autoRecoverGovernanceErrors',
    ],
  },
};
