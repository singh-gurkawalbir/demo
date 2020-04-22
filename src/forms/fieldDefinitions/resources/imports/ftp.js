export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
  },
  'ftp.fileName': {
    type: 'timestampfilename',
    label: 'File name',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => (r && r.ftp && r.ftp.fileName) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type'],
    validWhen: {
      someAreTrue: {
        message:
          'Please append date and time stamp, such as {{timestamp(YYYY-MM-DD hh:mm:ss)}}.',
        conditions: [
          {
            field: 'file.skipAggregation',
            isNot: {
              values: [true],
            },
          },
          {
            matchesRegEx: {
              pattern: `{{timestamp}}|{{dateFormat|{{timestamp((?=.*x).*)}}|{{timestamp((?=.*X).*)}}|{{timestamp((?=.*mm)(?=.*ss).*)}}`,
            },
          },
        ],
      },
    },
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
    label: 'In progress file name',
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
  'ftp.blobFileName': {
    type: 'timestampfilename',
    label: 'File name',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => (r && r.ftp && r.ftp.fileName) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type'],
    validWhen: {
      someAreTrue: {
        message:
          'Please append date and time stamp, such as {{timestamp(YYYY-MM-DD hh:mm:ss)}}.',
        conditions: [
          {
            field: 'file.skipAggregation',
            isNot: {
              values: [true],
            },
          },
          {
            matchesRegEx: {
              pattern: `{{timestamp}}|{{dateFormat|{{timestamp((?=.*x).*)}}|{{timestamp((?=.*X).*)}}|{{timestamp((?=.*mm)(?=.*ss).*)}}`,
            },
          },
        ],
      },
    },
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'ftp.blobUseTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
    defaultValue: r => !!(r && r.ftp && r.ftp.inProgressFileName),
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'ftp.blobInProgressFileName': {
    type: 'text',
    label: 'In progress file name',
    defaultValue: r => r && r.ftp && r.ftp.inProgressFileName,
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
