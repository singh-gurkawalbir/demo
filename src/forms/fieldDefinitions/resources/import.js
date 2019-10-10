export default {
  // #region resource import
  // #region netsuite
  name: {
    type: 'text',
    label: 'Name',
  },
  description: {
    type: 'text',
    label: 'Description',
  },
  apiIdentifier: {
    label: 'Invoke this Export [POST]',
    type: 'apiidentifier',
  },
  // #region ftp
  'ftp.importFrom': {
    type: 'labeltitle',
    label: 'Where would you like to import the data?',
  },
  'ftp.directoryPath1': {
    type: 'text',
    label: 'Ftp directory Path1',
  },
  'file.type': {
    type: 'select',
    label: 'File type',
    options: [
      {
        items: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'XLSX', value: 'xlsx' },
          { label: 'XML', value: 'xml' },
          // { label: 'Filedefinition', value: 'filedefinition' },
          { label: 'EDI X12', value: 'edi' },
          { label: 'Fixed width', value: 'fixedWidth' },
        ],
      },
    ],
  },
  'ftp.fileName': {
    type: 'text',
    label: 'Ftp file Name',
  },
  'ftp.importMapping': {
    type: 'labeltitle',
    label: 'How should the data be mapped?',
  },
};
