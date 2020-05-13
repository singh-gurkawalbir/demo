export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

    newValues['/type'] = newValues['/ftp/useSFTP'] ? 'sftp' : 'ftp';

    delete newValues['/ftp/useSFTP'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'ftp.hostURI': { fieldId: 'ftp.hostURI' },
    'ftp.useSFTP': { fieldId: 'ftp.useSFTP' },
    'ftp.username': { fieldId: 'ftp.username' },
    'ftp.password': { fieldId: 'ftp.password' },
    'ftp.authKey': { fieldId: 'ftp.authKey' },
    'ftp.usePassiveMode': { fieldId: 'ftp.usePassiveMode' },
    'ftp.userDirectoryIsRoot': { fieldId: 'ftp.userDirectoryIsRoot' },
  },
  layout: {
    fields: [
      'name',
      'ftp.hostURI',
      'ftp.useSFTP',
      'ftp.username',
      'ftp.password',
      'ftp.authKey',
      'ftp.usePassiveMode',
      'ftp.userDirectoryIsRoot',
    ],
    type: 'collapse',
  },
};
