export default {
  'as2.fileNameTemplate': {
    type: 'text',
    label: 'As2 file Name Template',
  },
  'as2.messageIdTemplate': {
    type: 'text',
    label: 'As2 message Id Template',
  },
  'as2.maxRetries': {
    type: 'text',
    label: 'As2 max Retries',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.headers[*].name': {
    type: 'text',
    label: 'As2 headers[*] name',
  },
};
