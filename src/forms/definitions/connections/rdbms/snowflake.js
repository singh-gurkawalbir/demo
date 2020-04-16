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
      defaultValue: r => {
        const baseUri = r && r.rdbms && r.rdbms.host;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.snowflakecomputing.com')
          );

        return subdomain;
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
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
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
        fields: ['rdbmsAdvanced'],
      },
    ],
  },
};
