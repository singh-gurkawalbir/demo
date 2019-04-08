export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  optionsHandler(fieldId, fields) {
    if (fieldId === 'connection.ftp.port') {
      const ftpPortField = fields.find(
        field => field.id === 'connection.ftp.port'
      );

      if (!ftpPortField.value) {
        const ftpTypeField = fields.find(
          field => field.id === 'connection.ftp.type'
        );

        if (ftpTypeField.value === 'sftp') {
          return [22];
        }

        return [21];
      }
    }
  },
  fields: [
    { id: 'connection.name' },
    { id: 'connection.type', disabled: true },
    {
      id: 'connection.ftp.hostURI',
      description:
        'If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.',
    },
    { id: 'connection.ftp.type' },
    {
      id: 'connection.ftp.username',
    },
    {
      id: 'connection.ftp.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'connection.ftp.authKey',
      placeholder: 'Optional if password is entered',
      multiline: true,
      visibleWhen: [
        {
          field: 'connection.ftp.type',
          is: ['sftp'],
        },
      ],
    },
    {
      id: 'connection.ftp.useImplicitFtps',

      visibleWhen: [
        {
          field: 'connection.ftp.type',
          is: ['ftps'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        {
          id: 'connection.ftp.port',
          refreshOptionsOnChangesTo: 'connection.ftp.type',
        },
        {
          id: 'connection.ftp.usePassiveMode',

          visibleWhen: [
            {
              field: 'connection.ftp.type',
              is: ['ftp', 'ftps'],
            },
          ],
        },
        {
          id: 'connection.ftp.userDirectoryIsRoot',
        },
        { id: 'connection.ftp.entryParser' },
        {
          id: 'connection.ftp.requireSocketReUse',
          description:
            'Note: for security reasons this field must always be re-entered.',

          visibleWhen: [
            {
              field: 'connection.ftp.type',
              is: ['ftps'],
            },
          ],
        },
        {
          id: 'connection.ftp.usePgp',
        },
        {
          id: 'connection.ftp.pgpEncryptKey',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connection.ftp.usePgp',
              is: [true],
            },
          ],
        },
        {
          id: 'connection.ftp.pgpDecryptKey',

          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connection.ftp.usePgp',
              is: [true],
            },
          ],
        },
        {
          id: 'connection.ftp.pgpPassphrase',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connection.ftp.usePgp',
              is: [true],
            },
          ],
        },
      ],
    },
  ],
};
