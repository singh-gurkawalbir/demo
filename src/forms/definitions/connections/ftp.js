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
          return 22;
        }

        return 21;
      }
    }

    return null;
  },
  fields: [
    { fieldId: 'name' },
    { fieldId: 'type', disabled: true },
    {
      fieldId: 'ftp.hostURI',
    },
    { fieldId: 'ftp.type' },
    {
      fieldId: 'ftp.username',
    },
    {
      fieldId: 'ftp.password',
    },
    {
      fieldId: 'ftp.authKey',

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
          refreshOptionsOnChangesTo: ['ftp.type', 'ftp.port'],
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
        {
          fieldId: 'ftp.entryParser',
          required: true,
          validWhen: {
            isNot: {
              values: [''],
              message: 'An option must be selected',
            },
          },
        },
        {
          fieldId: 'ftp.requireSocketReUse',

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
