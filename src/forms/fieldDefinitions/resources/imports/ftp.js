export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
  },
  'ftp.fileName': {
    type: 'text',
    label: 'File Name',
    required: true,
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
