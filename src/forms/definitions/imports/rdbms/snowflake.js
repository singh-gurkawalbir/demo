export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    if (newValues['/rdbms/queryType'] === 'BULK INSERT') {
      newValues['/rdbms/query'] = undefined;
    }

    if (newValues['/rdbms/queryType'] === 'INSERT') {
      newValues['/rdbms/bulkInsert'] = undefined;
      delete newValues['/rdbms/bulkInsert/tableName'];
      delete newValues['/rdbms/bulkInsert/batchSize'];
    }

    newValues['/rdbms/queryType'] = [newValues['/rdbms/queryType']];

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
    'rdbms.bulkInsert.batchSize': {
      id: 'rdbms.bulkInsert.batchSize',
      type: 'text',
      label: 'Batch size',
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['BULK INSERT'],
        },
      ],
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
      defaultValue: r => r && r.rdbms && r.rdbms.queryType[0],
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
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbms.bulkInsert.batchSize'],
      },
    ],
  },
};
