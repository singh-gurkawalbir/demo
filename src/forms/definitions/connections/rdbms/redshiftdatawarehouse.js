export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'redshift',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'rdbms.redshift.region': {
      fieldId: 'rdbms.redshift.region',
    },
    'rdbms.redshift.accessKeyId': {
      fieldId: 'rdbms.redshift.accessKeyId',
    },
    'rdbms.redshift.secretAccessKey': {
      fieldId: 'rdbms.redshift.secretAccessKey',
    },
    'rdbms.database': {
      fieldId: 'rdbms.database',
      helpKey: 'connection.rdbms.redshift.database',
    },
    'rdbms.redshift.clusterIdentifier': {
      fieldId: 'rdbms.redshift.clusterIdentifier',
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
          'rdbms.redshift.region',
          'rdbms.redshift.accessKeyId',
          'rdbms.redshift.secretAccessKey',
          'rdbms.database',
          'rdbms.redshift.clusterIdentifier',
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
