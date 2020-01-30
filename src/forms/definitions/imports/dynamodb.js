export default {
  preSave: formValues => {
    const retValues = {
      ...formValues,
    };

    if (retValues['/dynamodb/method'] === 'putItem') {
      if (retValues['/dynamodb/conditionExpression'] === '') {
        retValues['/dynamodb/expressionAttributeValues'] = undefined;
        retValues['/dynamodb/expressionAttributeNames'] = undefined;
      }
    } else {
      retValues['/dynamodb/itemDocument'] = undefined;
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
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
    },
    'dynamodb.expressionAttributeValues': {
      fieldId: 'dynamodb.expressionAttributeValues',
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
    dataMappings: {
      formId: 'dataMappings',
    },
  },
  layout: {
    fields: [
      'common',
      'importData',
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
    type: 'collapse',
    containers: [],
  },
};
