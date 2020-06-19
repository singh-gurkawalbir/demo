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
      helpKey: 'snowflake.connection.rdbms.host',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Account name should not contain spaces.',
        },
      },
      label: 'Account name',
    },
    'rdbms.database': {
      fieldId: 'rdbms.database',
      helpKey: 'snowflake.connection.rdbms.database',
    },
    'rdbms.user': {
      fieldId: 'rdbms.user',
      helpKey: 'snowflake.connection.rdbms.user',
    },
    'rdbms.password': {
      fieldId: 'rdbms.password',
      helpKey: 'snowflake.connection.rdbms.password',
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
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
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
          'rdbms.host',
          'rdbms.database',
          'rdbms.snowflake.warehouse',
          'rdbms.user',
          'rdbms.password',
        ],
      },
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
