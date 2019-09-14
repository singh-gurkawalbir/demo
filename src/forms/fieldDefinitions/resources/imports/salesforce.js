export default {
  'salesforce.api': {
    type: 'radiogroup',
    label: 'API Type',
    required: true,
    options: [
      {
        items: [
          { label: 'SOAP(Recomended)', value: 'soap' },
          { label: 'REST', value: 'rest' },
          { label: 'Composite', value: 'compositerecord' },
        ],
      },
    ],
  },
  'salesforce.sObjectType': {
    type: 'select',
    label: 'SObject Type',
    required: true,
    options: [
      {
        // To do replace values statistically instead of dynamic
        items: [
          { label: 'Account', value: 'account' },
          { label: 'Customer', value: 'customer' },
        ],
      },
    ],
  },
  'salesforce.operation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Insert/Update', value: 'addupdate' },
          { label: 'Upsert', value: 'upsert' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'salesforce.api',
        is: ['soap', 'rest'],
      },
    ],
  },
  'salesforce.compositeOperation': {
    type: 'radiogroup',
    label: 'Operation',
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Insert/Update', value: 'addupdate' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'salesforce.api',
        is: ['compositerecord'],
      },
    ],
  },
  'salesforce.idLookup.extract': {
    type: 'text',
    label: 'How can we find existing records?',
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate'],
      },
    ],
  },
  'salesforce.idLookup.whereClause': {
    type: 'text',
    label: 'Where Clause',
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate'],
      },
    ],
  },
  'salesforce.upsertpicklistvalues.fullName': {
    type: 'select',
    label: 'Which External ID field should be used to Upsert?',
    options: [
      {
        // To do replace statistically instead of dynamic
        items: [
          { label: 'AccountID', value: 'accountid' },
          { label: 'CustomerID', value: 'customerid' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'salesforce.operation',
        is: ['upsert'],
      },
    ],
  },
  'salesforce.upsert.externalIdField': {
    type: 'text',
    label: 'Which export data field should map to External ID?',
    visibleWhen: [
      {
        field: 'salesforce.operation',
        is: ['upsert'],
      },
    ],
  },
};
