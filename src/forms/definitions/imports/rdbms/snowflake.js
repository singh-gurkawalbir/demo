export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/rdbms/queryType'] === 'BULK INSERT') {
      newValues['/rdbms/query'] = undefined;
    }
    if (newValues['/rdbms/queryType'] === 'MERGE') {
      newValues['/rdbms/bulkInsert'] = undefined;
      delete newValues['/rdbms/bulkInsert/tableName'];
      delete newValues['/rdbms/bulkInsert/batchSize'];
    }
    if (newValues['/rdbms/queryType'] === 'INSERT') {
      newValues['/rdbms/bulkInsert'] = undefined;
      delete newValues['/rdbms/bulkInsert/tableName'];
      delete newValues['/rdbms/bulkInsert/batchSize'];
    }

    newValues['/rdbms/queryType'] = [newValues['/rdbms/queryType']];

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'rdbms.query'
    ) {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const queryTypeField = fields.find(
        field => field.id === 'rdbms.queryType'
      );
      const modelMetadataField = fields.find(
        field => field.fieldId === 'modelMetadata'
      );
      let queryTypeVal;

      if (queryTypeField) {
        queryTypeVal = queryTypeField && queryTypeField.value;
      }

      return {
        queryType: queryTypeVal,
        modelMetadataFieldId: modelMetadataField.fieldId,
        modelMetadata: modelMetadataField && modelMetadataField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
      };
    }

    return null;
  },

  fieldMap: {
    common: { formId: 'common' },
    modelMetadata: { fieldId: 'modelMetadata', visible: false },
    'rdbms.lookups': { fieldId: 'rdbms.lookups', visible: false },
    'rdbms.bulkInsert.batchSize': {
      id: 'rdbms.bulkInsert.batchSize',
      type: 'text',
      label: 'Batch size',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
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
      label: 'Query builder',
      required: true,
      title: 'SQL Query Builder',
      refreshOptionsOnChangesTo: ['rdbms.lookups',
        'rdbms.queryType',
        'modelMetadata'],
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['INSERT', 'MERGE'],
        },
      ],
    },
    'rdbms.bulkInsert.tableName': {
      fieldId: 'rdbms.bulkInsert.tableName',
    },
    apiIdentifier: { fieldId: 'apiIdentifier' },
    'rdbms.queryType': {
      id: 'rdbms.queryType',
      type: 'radiogroup',
      label: 'Choose type',
      required: true,
      helpKey: 'snowflake.import.rdbms.queryType',
      defaultValue: r => r && r.rdbms && r.rdbms.queryType[0],
      options: [
        {
          items: [
            { label: 'Use bulk insert SQL Query', value: 'BULK INSERT' },
            { label: 'Use SQL Query', value: 'INSERT' },
            { label: 'Use MERGE SQL Query', value: 'MERGE' },
          ],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings', 'modelMetadata'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'rdbms.queryType',
          'rdbms.lookups',
          'rdbms.bulkInsert.tableName',
          'rdbms.query',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbms.bulkInsert.batchSize', 'apiIdentifier'],
      },
    ],
  },
};
