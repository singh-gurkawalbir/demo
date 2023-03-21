import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = {
      ...formValues,
    };

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

    retValues['/mockResponse'] = safeParse(retValues['/mockResponse']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    'dynamodb.region': {
      fieldId: 'dynamodb.region',
    },
    'dynamodb.method': {
      fieldId: 'dynamodb.method',
    },
    'dynamodb.tableName': {
      fieldId: 'dynamodb.tableName',
    },
    'dynamodb.partitionKey': {
      fieldId: 'dynamodb.partitionKey',
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      type: 'checkboxforresetfields',
      fieldsToReset: [{ id: 'ignoreMissing', type: 'checkbox' }],
      visibleWhen: [
        {
          field: 'dynamodb.method',
          is: ['putItem'],
        },
        {
          field: 'dynamodb.method',
          is: ['updateItem'],
        },
      ],
    },
    'dynamodb.sortKey': {
      fieldId: 'dynamodb.sortKey',
    },
    'dynamodb.itemDocument': {
      fieldId: 'dynamodb.itemDocument',
      removeWhen: [{ field: 'dynamodb.method', isNot: ['putItem'] }],
    },
    'dynamodb.updateExpression': {
      fieldId: 'dynamodb.updateExpression',
    },
    'dynamodb.conditionExpression': {
      fieldId: 'dynamodb.conditionExpression',
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      type: 'checkboxforresetfields',
      fieldsToReset: [{ id: 'ignoreExisting', type: 'checkbox' }],
      visibleWhen: [
        {
          field: 'dynamodb.method',
          is: ['putItem'],
        },
        {
          field: 'dynamodb.method',
          is: ['updateItem'],
        },
      ],
    },
    'dynamodb.expressionAttributeNames': {
      fieldId: 'dynamodb.expressionAttributeNames',
      removeWhenAll: [
        { field: 'dynamodb.method', is: ['putItem'] },
        { field: 'dynamodb.conditionExpression', is: [''] },
      ],
    },
    'dynamodb.expressionAttributeValues': {
      fieldId: 'dynamodb.expressionAttributeValues',
      removeWhenAll: [
        { field: 'dynamodb.method', is: ['putItem'] },
        { field: 'dynamodb.conditionExpression', is: [''] },
      ],
    },
    'dynamodb.ignoreExtract': {
      fieldId: 'dynamodb.ignoreExtract',
      visibleWhen: [
        {
          field: 'ignoreExisting',
          is: [true],
        },
        {
          field: 'ignoreMissing',
          is: [true],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
    mockResponseSection: {formId: 'mockResponseSection'},
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
        label: 'How would you like the records imported?',
        fields: [
          'dynamodb.method',
          'dynamodb.region',
          'dynamodb.tableName',
          'dynamodb.expressionAttributeNames',
          'dynamodb.expressionAttributeValues',
          'dynamodb.partitionKey',
          'dynamodb.sortKey',
          'dynamodb.conditionExpression',
          'ignoreExisting',
          'ignoreMissing',
          'dynamodb.ignoreExtract',
          'dynamodb.itemDocument',
          'dynamodb.updateExpression',
        ],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
