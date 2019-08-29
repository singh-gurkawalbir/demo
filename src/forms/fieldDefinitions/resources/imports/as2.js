export default {
  'as2.ediFormat': {
    type: 'select',
    label: 'EDI Format',
    required: true,
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
};
