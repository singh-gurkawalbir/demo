export default {
  'as2.fileNameTemplate': {
    type: 'uri',
    showLookup: false,
    showExtract: false,
    label: 'File name',
    required: true,
    showAllSuggestions: true,
    defaultValue: r =>
      (r && r.as2 && r.as2.fileNameTemplate) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type'],
    editorTitle:
      'Use this editor if your File Name should be dynamically generated',
    connectionId: r => r && r._connectionId,
  },
  'as2.messageIdTemplate': {
    type: 'uri',
    showLookup: false,
    showExtract: false,
    label: 'Message ID',
    editorTitle:
      'Use this editor if your Message ID should be dynamically generated',
    connectionId: r => r && r._connectionId,
  },
  'as2.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'as2.maxRetries': {
    type: 'select',
    label: 'Max retries',
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
