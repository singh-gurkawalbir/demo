export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/ftp/entryParser'] === '') {
      delete newValues['/ftp/entryParser'];
    }
    if (!newValues['/ftp/usePgp']) {
      newValues['/ftp/pgpEncryptKey'] = undefined;
      newValues['/ftp/pgpDecryptKey'] = undefined;
      newValues['/ftp/pgpPassphrase'] = undefined;
      newValues['/ftp/pgpKeyAlgorithm'] = undefined;
    } else if (!newValues['/ftp/useCustomPGPEncryptionAlgorithm']) {
      newValues['/ftp/pgpKeyAlgorithm'] = undefined;
    }

    return newValues;
  },
  optionsHandler(fieldId, fields) {
    if (fieldId === 'ftp.port') {
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

    return null;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'ftp.hostURI': { fieldId: 'ftp.hostURI' },
    'ftp.type': { fieldId: 'ftp.type' },
    'ftp.username': { fieldId: 'ftp.username' },
    'ftp.password': { fieldId: 'ftp.password' },
    'ftp.authKey': {
      fieldId: 'ftp.authKey',
      visibleWhen: [{ field: 'ftp.type', is: ['sftp'] }],
    },
    'ftp.useImplicitFtps': {
      fieldId: 'ftp.useImplicitFtps',
      visibleWhen: [{ field: 'ftp.type', is: ['ftps'] }],
    },
    'ftp.port': {
      fieldId: 'ftp.port',
      refreshOptionsOnChangesTo: ['ftp.type', 'ftp.useImplicitFtps'],
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Must be a number.' },
      },
    },
    'ftp.usePassiveMode': {
      fieldId: 'ftp.usePassiveMode',
      visibleWhen: [{ field: 'ftp.type', is: ['ftp', 'ftps'] }],
    },
    'ftp.userDirectoryIsRoot': { fieldId: 'ftp.userDirectoryIsRoot' },
    'ftp.concurrencyLevel': { fieldId: 'ftp.concurrencyLevel' },
    'ftp.entryParser': { fieldId: 'ftp.entryParser', required: false },
    'ftp.requireSocketReUse': {
      fieldId: 'ftp.requireSocketReUse',
      visibleWhen: [{ field: 'ftp.type', is: ['ftps'] }],
    },
    'ftp.usePgp': { fieldId: 'ftp.usePgp' },
    'ftp.pgpEncryptKey': {
      fieldId: 'ftp.pgpEncryptKey',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'ftp.usePgp', is: [true] }],
    },
    'ftp.pgpDecryptKey': {
      fieldId: 'ftp.pgpDecryptKey',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'ftp.usePgp', is: [true] }],
    },
    'ftp.pgpPassphrase': {
      fieldId: 'ftp.pgpPassphrase',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'ftp.usePgp', is: [true] }],
    },
    'ftp.pgpKeyAlgorithm': {
      fieldId: 'ftp.pgpKeyAlgorithm',
      omitWhenHidden: true,
      visibleWhenAll: [
        { field: 'ftp.useCustomPGPEncryptionAlgorithm', is: [true] },
        { field: 'ftp.usePgp', is: [true] },
      ],
    },
    'ftp.useCustomPGPEncryptionAlgorithm': {
      id: 'ftp.useCustomPGPEncryptionAlgorithm',
      label: 'Use custom PGP encryption algorithm',
      type: 'checkbox',
      defaultValue: r => !!(r && r.ftp && r.ftp.pgpKeyAlgorithm),
      visibleWhen: [{ field: 'ftp.usePgp', is: [true] }],
    },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'ftp.hostURI',
          'ftp.type',
          'ftp.username',
          'ftp.password',
          'ftp.authKey',
          'ftp.useImplicitFtps',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'ftp.port',
          'ftp.usePassiveMode',
          'ftp.userDirectoryIsRoot',
          'ftp.entryParser',
          'ftp.requireSocketReUse',
          'ftp.usePgp',
          'ftp.pgpEncryptKey',
          'ftp.pgpDecryptKey',
          'ftp.pgpPassphrase',
          'ftp.useCustomPGPEncryptionAlgorithm',
          'ftp.pgpKeyAlgorithm',
          'ftp.concurrencyLevel',
        ],
      },
    ],
  },
};
