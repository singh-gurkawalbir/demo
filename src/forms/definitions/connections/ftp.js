import { updatePGPFormValues } from '../../metaDataUtils/fileUtil';

export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  preSave: formValues => {
    const newValues = updatePGPFormValues(formValues);

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
    'ftp.entryParser': { fieldId: 'ftp.entryParser',
      required: false,
      removeWhen: [{field: 'ftp.entryParser', is: [''] }],
    },
    'ftp.requireSocketReUse': {
      fieldId: 'ftp.requireSocketReUse',
      visibleWhen: [{ field: 'ftp.type', is: ['ftps'] }],
    },
    fileAdvanced: {formId: 'fileAdvanced'},
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
          'fileAdvanced',
          'ftp.concurrencyLevel',
        ],
      },
    ],
  },
};
