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
      label: 'Export type',
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
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Test – export only 1 record', value: 'test' },
          ],
        },
      ],
    },
    'delta.dateField': {
      fieldId: 'delta.dateField',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
      type: 'text',
      label: 'Once boolean field',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common'],
      },
      {
        collapsed: true,
        label: 'What would you like to export?',
        fields: [
          'dynamodb.region',
          'dynamodb.method',
          'dynamodb.tableName',
          'dynamodb.expressionAttributeNames',
          'dynamodb.expressionAttributeValues',
          'dynamodb.keyConditionExpression',
          'dynamodb.filterExpression',
          'dynamodb.projectionExpression',
        ],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'delta.dateField',
          'once.booleanField',
          'dynamodb.onceExportPartitionKey',
          'dynamodb.onceExportSortKey',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
