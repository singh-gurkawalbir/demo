import { safeParse } from '../../../../utils/string';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/rdbms/queryType'] === 'MERGE') {
      newValues['/rdbms/bulkInsert'] = undefined;
      delete newValues['/rdbms/bulkInsert/tableName'];
    }
    if (newValues['/rdbms/queryType'] === 'INSERT') {
      newValues['/rdbms/bulkInsert'] = undefined;
      delete newValues['/rdbms/bulkInsert/tableName'];
      delete newValues['/rdbms/bulkInsert/batchSize'];
    }

    newValues['/rdbms/queryType'] = [newValues['/rdbms/queryType']];

    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }
    newValues['/mockResponse'] = safeParse(newValues['/mockResponse']);

    return newValues;
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
      deleteWhen: [{field: 'rdbms.queryType', is: ['MERGE']}],
    },
    'rdbms.query': {
      id: 'rdbms.query',
      type: 'sqlquerybuilder',
      arrayIndex: 0,
      required: true,
      label: 'SQL query',
      defaultValue: r => {
        if (!r?.rdbms?.query) {
          return '';
        }

        return r.rdbms.query[0];
      },
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['INSERT', 'MERGE', 'COPY'],
        },
      ],
      removeWhen: [{ field: 'rdbms.queryType', is: ['BULK INSERT'] }],
    },
    advancedSettings: { formId: 'advancedSettings' },
    'rdbms.queryType': {
      id: 'rdbms.queryType',
      type: 'radiogroup',
      label: 'Choose type',
      required: true,
      helpKey: 'redshift.import.rdbms.queryType',
      defaultValue: r => r && r.rdbms && r.rdbms.queryType[0],
      options: [
        {
          items: [
            { label: 'Use SQL query once per record', value: 'INSERT' },
            { label: 'Use SQL query once per page of records', value: 'MERGE' },
            { label: 'Use SQL query on first page only', value: 'COPY' },
          ],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    mockResponseSection: {formId: 'mockResponseSection'},
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
          'rdbms.query',
        ],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbms.bulkInsert.batchSize', 'advancedSettings'],
      },
    ],
  },
};
