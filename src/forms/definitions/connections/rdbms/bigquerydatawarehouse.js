export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'bigquery',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'rdbms.bigquery.projectId': {
      fieldId: 'rdbms.bigquery.projectId',
    },
    'rdbms.bigquery.clientEmail': {
      fieldId: 'rdbms.bigquery.clientEmail',
    },
    'rdbms.bigquery.privateKey': {
      fieldId: 'rdbms.bigquery.privateKey',
    },
    'rdbms.bigquery.dataset': {
      fieldId: 'rdbms.bigquery.dataset',
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'rdbms.bigquery.projectId',
          'rdbms.bigquery.clientEmail',
          'rdbms.bigquery.privateKey',
          'rdbms.bigquery.dataset',
        ] },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'rdbms.concurrencyLevel',
        ],
      },
    ],
  },
};
