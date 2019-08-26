export default {
  'as2.ediFormat': {
    type: 'select',
    label: 'EDI Format',
    options: [
      {
        items: [
          { label: 'Generic 180', value: 'generic180' },
          { label: 'Generic 850', value: 'generic850' },
        ],
      },
    ],
  },
  'as2.fileName': {
    type: 'text',
    label: 'File Name',
  },
  'as2.messageId': {
    type: 'text',
    label: 'Message Id',
  },
  'as2.headers': {
    type: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'as2.parentOption': {
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
  'as2.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'as2.parentOption',
        is: ['true'],
      },
    ],
  },
  'as2.compressFiles': {
    type: 'checkbox',
    label: 'Compress Files',
  },
  'as2.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [
      {
        items: [{ label: 'gzip', value: 'gzip' }],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.compressFiles',
        is: [true],
      },
    ],
  },
  'as2.maxRetries': {
    type: 'select',
    label: 'Max Retries',
    options: [
      {
        items: [
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
        ],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
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
