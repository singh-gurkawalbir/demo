export default {
  // The optionsHandler handler runs for every field
  optionsHandler(fieldId, fields) {
    if (fieldId === 'connectionFtpPort') {
      const ftpPortField = fields.find(
        field => field.id === 'connectionFtpPort'
      );

      if (!ftpPortField.value) {
        const ftpTypeField = fields.find(
          field => field.id === 'connectionFtpType'
        );

        console.log(`check ftp ${JSON.stringify(ftpTypeField)}`);

        if (ftpTypeField.value === 'sftp') {
          console.log('In sftp');

          return [22];
        }

        return [21];
      }
    }
  },
  fields: [
    { id: 'connectionName' },
    { id: 'connectionType', disabled: true },
    {
      id: 'connectionFtpHostURI',
      description:
        'If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.',
    },
    { id: 'connectionFtpType' },
    {
      id: 'connectionFtpUsername',
    },
    {
      id: 'connectionFtpPassword',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'connectionFtpAuthKey',
      placeholder: 'Optional if password is entered',
      multiline: true,
      visibleWhen: [
        {
          field: 'connectionFtpType',
          is: ['sftp'],
        },
      ],
    },
    {
      id: 'connectionFtpUseImplicitFtps',

      visibleWhen: [
        {
          field: 'connectionFtpType',
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
          id: 'connectionFtpPort',
          refreshOptionsOnChangesTo: 'connectionFtpType',
        },
        {
          id: 'connectionFtpUsePassiveMode',

          visibleWhen: [
            {
              field: 'connectionFtpType',
              is: ['ftp', 'ftps'],
            },
          ],
        },
        {
          id: 'connectionFtpUserDirectoryIsRoot',
        },
        { id: 'connectionFtpEntryParser' },
        {
          id: 'connectionFtpRequireSocketReUse',
          description:
            'Note: for security reasons this field must always be re-entered.',

          visibleWhen: [
            {
              field: 'connectionFtpType',
              is: ['ftps'],
            },
          ],
        },
        {
          id: 'connectionFtpUsePgp',
        },
        {
          id: 'connectionFtpPgpEncryptKey',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connectionFtpUsePgp',
              is: [true],
            },
          ],
        },
        {
          id: 'connectionFtpPgpDecryptKey',

          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connectionFtpUsePgp',
              is: [true],
            },
          ],
        },
        {
          id: 'connectionFtpPgpPassphrase',
          description:
            'Note: for security reasons this field must always be re-entered.',
          required: true,
          omitWhenHidden: true,
          visibleWhen: [
            {
              field: 'connectionFtpUsePgp',
              is: [true],
            },
          ],
        },
      ],
    },
  ],
};
