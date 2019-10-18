export default {
  fieldMap: {
    'rdbms.host': { fieldId: 'rdbms.host' },
    'rdbms.database': { fieldId: 'rdbms.database' },
    'rdbms.user': { fieldId: 'rdbms.user' },
    'rdbms.password': {
      fieldId: 'rdbms.password',
      requiredWhen: [
        {
          field: 'rdbms.useSSL',
          is: [''],
        },
        {
          field: 'rdbms.ssl.ca',
          is: [''],
        },
        {
          field: 'rdbms.ssl.key',
          is: [''],
        },
        {
          field: 'rdbms.ssl.cert',
          is: [''],
        },
      ],
    },
  },
  layout: {
    fields: ['rdbms.host', 'rdbms.database', 'rdbms.user', 'rdbms.password'],
  },
};
