import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateField'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/delta/dateField'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateField'];
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export from DynamoDB?',
    },
    'dynamodb.region': { fieldId: 'dynamodb.region' },
    'dynamodb.method': { fieldId: 'dynamodb.method' },
    'dynamodb.tableName': { fieldId: 'dynamodb.tableName' },
    'dynamodb.keyConditionExpression': {
      fieldId: 'dynamodb.keyConditionExpression',
    },
    'dynamodb.filterExpression': { fieldId: 'dynamodb.filterExpression' },
    'dynamodb.expressionAttributeNames': {
      fieldId: 'dynamodb.expressionAttributeNames',
    },
    'dynamodb.projectionExpression': {
      fieldId: 'dynamodb.projectionExpression',
    },
    'dynamodb.expressionAttributeValues': {
      fieldId: 'dynamodb.expressionAttributeValues',
    },
    'dynamodb.onceExportPartitionKey': {
      fieldId: 'dynamodb.onceExportPartitionKey',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    'dynamodb.onceExportSortKey': {
      fieldId: 'dynamodb.onceExportSortKey',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },

    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
    },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'dynamodb.region',
      'dynamodb.method',
      'dynamodb.tableName',
      'dynamodb.keyConditionExpression',
      'dynamodb.filterExpression',
      'dynamodb.projectionExpression',
      'dynamodb.expressionAttributeNames',
      'dynamodb.expressionAttributeValues',
      'type',
      'dynamodb.onceExportPartitionKey',
      'dynamodb.onceExportSortKey',
    ],
  },
};
