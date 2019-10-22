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
  },
  'ftp.inProgressFileName': {
    type: 'text',
    label: 'In Progress File Name',
    visibleWhen: [
      {
        field: 'ftp.useTempFile',
        is: [true],
      },
    ],
  },
};
