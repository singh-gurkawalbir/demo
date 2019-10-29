export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
  },
  'ftp.fileName': {
    type: 'autosuggest',
    label: 'File Name',
    required: true,
    showAllSuggestions: true,
    defaultValue: 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type', 'ftp.fileName'],
  },
  'ftp.useTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'ftp.inProgressFileName': {
    type: 'text',
    label: 'In Progress File Name',
    visibleWhenAll: [
      {
        field: 'ftp.useTempFile',
        is: [true],
      },
      {
        field: 'inputMode',
        is: ['RECORDS'],
      },
    ],
  },
  'ftp.blobUseTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['BLOB'],
      },
    ],
  },
  'ftp.blobInProgressFileName': {
    type: 'text',
    label: 'In Progress File Name',
    visibleWhenAll: [
      {
        field: 'ftp.blobUseTempFile',
        is: [true],
      },
      {
        field: 'inputMode',
        is: ['BLOB'],
      },
    ],
  },
};
