export default {
  'ftp.directoryPath': {
    loggable: true,
    type: 'uri',
    label: 'Directory path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  'ftp.useTempFile': {
    loggable: true,
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
    loggable: true,
    type: 'ftpfilenamewitheditor',
    label: 'In progress file name',
    showAllSuggestions: true,
    defaultValue: r =>
      (r && r.ftp && r.ftp.inProgressFileName),
    refreshOptionsOnChangesTo: ['file.type', 'file.fileName'],
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
    loggable: true,
    type: 'ftpfilenamewitheditor',
    label: 'File name',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => r && r.file && r.file.fileName,
    validWhen: {
      someAreTrue: {
        message:
          'Please append date and time stamp, such as {{timestamp "YYYY-MM-DD hh:mm:ss" "America/Los_Angeles"}}.',
        conditions: [
          {
            field: 'file.skipAggregation',
            isNot: {
              values: [true],
            },
          },
          {
            matchesRegEx: {
              pattern: '{{timestamp "(?=.*x).*"}}|{{timestamp "(?=.*X).*"}}|{{timestamp "(?=.*mm)(?=.*ss).*"}}',
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
    loggable: true,
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
    loggable: true,
    type: 'ftpfilenamewitheditor',
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
