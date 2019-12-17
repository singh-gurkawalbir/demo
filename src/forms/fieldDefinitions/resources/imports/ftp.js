export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
  },
  'ftp.fileName': {
    type: 'timestampfilename',
    label: 'File Name',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => (r && r.ftp && r.ftp.fileName) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type'],
  },
  'ftp.useTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
    defaultValue: r => !!(r && r.ftp && r.ftp.inProgressFileName),
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'ftp.inProgressFileName': {
    type: 'timestampfilename',
    label: 'In Progress File Name',
    showAllSuggestions: true,
    defaultValue: r =>
      (r && r.ftp && r.ftp.inProgressFileName) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type', 'ftp.fileName'],
    visibleWhenAll: [
      {
        field: 'ftp.useTempFile',
        is: [true],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'ftp.blobUseTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
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
        is: ['blob'],
      },
    ],
  },
};
