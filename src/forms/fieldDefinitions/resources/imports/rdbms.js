export default {
  'rdbms.queryType': {
    type: 'radiogroup',
    label: 'Query Type',
    options: [
      {
        items: [
          { label: 'Insert', value: 'INSERT' },
          { label: 'Update', value: 'UPDATE' },
          { label: 'Insert or Update', value: 'COMPOSITE' },
        ],
      },
    ],
  },
  'rdbms.ignoreExistingRecords': {
    type: 'checkbox',
    label: 'Ignore Existing Records',
    validWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT'],
      },
    ],
  },
  'rdbms.ignoreMissingRecords': {
    type: 'checkbox',
    label: 'Ignore Missing Records',
    validWhen: [
      {
        field: 'rdbms.queryType',
        is: ['UPDATE'],
      },
    ],
  },
  'rdbms.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    validWhenAll: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT', 'UPDATE', 'COMPOSITE'],
      },
      {
        field: 'rdbms.ignoreExistingRecords',
        is: [true],
      },
      {
        field: 'rdbms.ignoreMissingRecords',
        is: [true],
      },
    ],
  },
  'rdbms.parentOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: 'false',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  'rdbms.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'ftp.parentOption',
        is: ['true'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Aggregate Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Aggregate Stack Id',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
};
