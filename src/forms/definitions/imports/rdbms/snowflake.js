export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/rdbms/bulkInsert/batchSize': 100,
    };

    return newValues;
  },
  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'rdbms.query': {
      id: 'rdbms.query',
      type: 'sqlquerybuilder',
      arrayIndex: 0,
      label: 'Launch Query Builder',
      title: 'SQL Query Builder',
      refreshOptionsOnChangesTo: ['rdbms.queryType', 'modelMetadata'],
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['INSERT'],
        },
      ],
    },
    'rdbms.bulkInsert.tableName': {
      fieldId: 'rdbms.bulkInsert.tableName',
    },
    'rdbms.queryType': {
      id: 'rdbms.queryType',
      type: 'radiogroup',
      label: 'Choose type',
      required: true,
      helpKey: 'connection.snowflake.rdbms.queryType',
      options: [
        {
          items: [
            { label: 'Use BULK INSERT', value: 'BULK INSERT' },
            { label: 'Use SQL Query', value: 'INSERT' },
          ],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    fields: [
      'common',
      'modelMetadata',
      'importData',
      'rdbms.queryType',
      'rdbms.bulkInsert.tableName',
      'rdbms.query',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};
