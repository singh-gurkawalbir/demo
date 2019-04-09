export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  optionsHandler(fieldId, fields) {
    if (fieldId === 'ftp.port') {
      const ftpPortField = fields.find(field => field.fieldId === 'ftp.port');

      if (!ftpPortField.value) {
        const ftpTypeField = fields.find(field => field.fieldId === 'ftp.type');

        if (ftpTypeField.value === 'sftp') {
          return [22];
        }

        return [21];
      }
    }
  },
  fields: [
    { fieldId: 'name' },
    { fieldId: 'type', disabled: true },
    {
      fieldId: 'ftp.hostURI',
      description:
        'If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.',
    },
    { fieldId: 'ftp.type' },
    {
      fieldId: 'ftp.username',
    },
    {
      fieldId: 'ftp.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      fieldId: 'ftp.authKey',
      placeholder: 'Optional if password is entered',
      multiline: true,
      visibleWhen: [
        {
          field: 'ftp.type',
          is: ['sftp'],
        },
      ],
    },
    {
      fieldId: 'ftp.useImplicitFtps',

      visibleWhen: [
        {
          field: 'ftp.type',
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
          fieldId: 'ftp.port',
          refreshOptionsOnChangesTo: 'ftp.type',
        },
        {
          fieldId: 'ftp.usePassiveMode',

          visibleWhen: [
            {
              field: 'ftp.type',
              is: ['ftp', 'ftps'],
            },
          ],
        },
        {
          fieldId: 'ftp.userDirectoryIsRoot',
        },
        { fieldId: 'ftp.entryParser' },
        {
          fieldId: 'ftp.requireSocketReUse',
          description:
            'Note: for security reasons this field must always be re-entered.',

          visibleWhen: [
            {
              field: 'ftp.type',
              is: ['ftps'],
            },
          ],
        },
        {
          fieldId: 'ftp.usePgp',
        },
        {
          fieldId: 'ftp.pgpEncryptKey',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'ftp.usePgp',
              is: [true],
            },
          ],
        },
        {
          fieldId: 'ftp.pgpDecryptKey',

          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'ftp.usePgp',
              is: [true],
            },
          ],
        },
        {
          fieldId: 'ftp.pgpPassphrase',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'ftp.usePgp',
              is: [true],
            },
          ],
        },
      ],
    },
  ],
};
