import { isNewId } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';

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

    if (retValues['/dynamodb/expressionAttributeNames']) {
      try {
        retValues['/dynamodb/expressionAttributeNames'] = JSON.stringify(JSON.parse(retValues['/dynamodb/expressionAttributeNames']));
      } catch (ex) {
        // do nothing
      }
    }

    if (retValues['/dynamodb/expressionAttributeValues']) {
      try {
        retValues['/dynamodb/expressionAttributeValues'] = JSON.stringify(JSON.parse(retValues['/dynamodb/expressionAttributeValues']));
      } catch (ex) {
        // do nothing
      }
    }

    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

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
      isLoggable: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
    },
    'test.limit': {fieldId: 'test.limit'},
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
    rdbmsGrouping: {formId: 'rdbmsGrouping' },
    advancedSettings: { formId: 'advancedSettings' },
    mockOutput: {fieldId: 'mockOutput'},
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
          'test.limit',
          'delta.dateField',
          'once.booleanField',
          'dynamodb.onceExportPartitionKey',
          'dynamodb.onceExportSortKey',
        ],
      },
      {
        collapsed: true,
        label: 'Would you like to group records?',
        fields: ['rdbmsGrouping'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
