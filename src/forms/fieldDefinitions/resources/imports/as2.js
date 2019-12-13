export default {
  'as2.fileNameTemplate': {
    type: 'relativeuri',
    label: 'File Name',
  },
  'as2.messageIdTemplate': {
    type: 'relativeuri',
    label: 'Message Id',
  },
  'as2.headers': {
    type: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'as2.maxRetries': {
    type: 'select',
    label: 'Max Retries',
    defaultValue: r => (r && r.as2 && r.as2.maxRetries) || 0,
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
