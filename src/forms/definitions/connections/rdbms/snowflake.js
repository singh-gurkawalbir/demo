export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'rdbms',
      '/rdbms/type': 'snowflake',
    };

    return newValues;
  },

  fieldMap: {
    name: { fieldId: 'name' },
    'rdbms.host': {
      fieldId: 'rdbms.host',
      startAdornment: 'https://',
      endAdornment: '.snowflakecomputing.com',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Account name should not contain spaces.',
        },
      },
      label: 'Account name',
    },
    'rdbms.database': { fieldId: 'rdbms.database' },
    'rdbms.user': { fieldId: 'rdbms.user' },
    'rdbms.password': {
      fieldId: 'rdbms.password',
    },
    'rdbms.snowflake.warehouse': {
      id: 'rdbms.snowflake.warehouse',
      type: 'text',
      label: 'Warehouse name',
      required: true,
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
  },
  layout: {
    fields: [
      'name',
      'rdbms.host',
      'rdbms.database',
      'rdbms.snowflake.warehouse',
      'rdbms.user',
      'rdbms.password',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'rdbms.concurrencyLevel',
        ],
      },
    ],
  },
};
