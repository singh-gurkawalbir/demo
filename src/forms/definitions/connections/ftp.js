export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  preSubmit: formValues => {
    const newValues = formValues;

    if (newValues['/ftp/entryParser'] === '') {
      delete newValues['/ftp/entryParser'];
    }

    return newValues;
  },
  optionsHandler(fieldId, fields) {
    if (fieldId === 'ftp.port') {
      const ftpPortField = fields.find(field => field.fieldId === 'ftp.port');

      if (!ftpPortField.value || [21, 22, 990].includes(ftpPortField.value)) {
        const ftpTypeField = fields.find(field => field.fieldId === 'ftp.type');

        if (ftpTypeField.value === 'sftp') {
          return 22;
        }

        if (ftpTypeField.value === 'ftps') {
          const useImplicitFTPS = fields.find(
            field => field.fieldId === 'ftp.useImplicitFtps'
          );

          if (useImplicitFTPS.value === true) {
            return 990;
          }
        }

        return 21;
      }

      return ftpPortField.value;
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
          refreshOptionsOnChangesTo: ['ftp.type', 'ftp.useImplicitFtps'],
          validWhen: {
            matchesRegEx: {
              pattern: '^[\\d]+$',
              message: 'Must be a number.',
            },
          },
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
