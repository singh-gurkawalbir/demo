import { isNewId } from '../../../utils/resource';

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
    label: 'Invoke this import [post]',
    type: 'apiidentifier',
    visible: r => r && !isNewId(r._id),
  },
  // #region ftp
  'ftp.importFrom': {
    type: 'labeltitle',
    label: 'Where would you like to import the data?',
  },
  'ftp.directoryPath1': {
    type: 'text',
    label: 'Ftp directory path1',
  },
  'file.type': {
    type: 'select',
    label: 'File type',
    options: [
      {
        items: [
          { label: 'CSV (or any delimited text file)', value: 'csv' },
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
    label: 'Ftp file name',
  },
  'ftp.importMapping': {
    type: 'labeltitle',
    label: 'How should the data be mapped?',
  },
};
