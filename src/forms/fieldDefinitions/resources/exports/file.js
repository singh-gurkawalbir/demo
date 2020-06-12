import { isNewId } from '../../../../utils/resource';
import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

export default {
  // TODO: why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample file (that would be exported)',
    mode: r => r && r.file && r.file.type,
    required: r => isNewId(r && r._id),
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'file.encoding': {
    type: 'select',
    label: 'File encoding',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'UTF-8', value: 'utf8' },
          { label: 'Windows-1252', value: 'win1252' },
          { label: 'UTF-16LE', value: 'utf-16le' },
        ],
      },
    ],
  },
  'file.type': {
    type: 'filetypeselect',
    label: 'File type',
    required: true,
    defaultValue: r => r && r.file && r.file.type,
    options: [
      {
        items: [
          { label: 'CSV (or any delimited text file)', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'XLSX', value: 'xlsx' },
          { label: 'XML', value: 'xml' },
          { label: 'EDI X12', value: 'filedefinition' },
          { label: 'Fixed Width', value: 'fixed' },
          { label: 'EDIFACT', value: 'delimited/edifact' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'file.skipDelete': {
    type: 'checkbox',
    label: 'Leave file on server',
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression format',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.purgeInternalBackup': {
    type: 'checkbox',
    label: 'File purge internal backup',
  },
  'file.json.resourcePath': {
    label: 'Resource path',
    type: 'jsonresourcepath',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['json'],
      },
    ],
  },
  'file.xml.resourcePath': {
    label: 'Resource path',
    type: 'text',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xml'],
      },
    ],
    required: true,
  },
  'file.fileDefinition.resourcePath': {
    label: 'Resource path',
    type: 'text',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
    ],
  },
  'edix12.format': {
    type: 'filedefinitionselect',
    label: 'EDI x12 format',
    required: true,
    format: 'edi',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
    ],
  },
  'fixed.format': {
    type: 'filedefinitionselect',
    label: 'Format',
    required: true,
    format: 'fixed',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT format',
    required: true,
    format: 'ediFact',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
    ],
  },
  'file.filedefinition.rules': {
    type: 'filedefinitioneditor',
    label: 'File parser helper',
    helpkey: 'export.file.filedefinition.rules',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
    ],
    refreshOptionsOnChangesTo: [
      'edix12.format',
      'fixed.format',
      'edifact.format',
      'file.fileDefinition.resourcePath',
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
    sampleData: r => r && r.sampleData,
  },
  'file.csvHelper': {
    type: 'csvparse',
    label: 'CSV parser helper:',
    helpKey: 'file.csvParse',
    refreshOptionsOnChangesTo: [
      'file.csv.keyColumns',
      'file.csv.columnDelimiter',
      'file.csv.rowDelimiter',
      'file.csv.trimSpaces',
      'file.csv.rowsToSkip',
      'file.csv.hasHeaderRow',
      'file.csv.keyColumns',
    ],
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.columnDelimiter': {
    id: 'file.csv.columnDelimiter',
    type: 'selectwithinput',
    label: 'Column delimiter',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    options: csvOptions.ColumnDelimiterOptions,
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.columnDelimiter) || ',',
  },
  'file.csv.rowDelimiter': {
    id: 'file.csv.rowDelimiter',
    type: 'select',
    label: 'Row delimiter',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    options: [
      {
        items: csvOptions.RowDelimiterOptions,
      },
    ],
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.rowDelimiter) || '\n',
  },
  'file.csv.trimSpaces': {
    id: 'file.csv.trimSpaces',
    type: 'checkbox',
    label: 'Trim spaces',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    defaultValue: r => !!(r && r.file && r.file.csv && r.file.csv.trimSpaces),
  },
  'file.csv.rowsToSkip': {
    id: 'file.csv.rowsToSkip',
    type: 'text',
    inputType: 'number',
    label: 'Number of rows to skip',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.rowsToSkip) || 0,
  },
  'file.csv.hasHeaderRow': {
    id: 'file.csv.hasHeaderRow',
    type: 'csvhasheaderrow',
    fieldToReset: 'file.csv.keyColumns',
    fieldResetValue: [],
    label: 'File has header',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    defaultValue: r => !!(r && r.file && r.file.csv && r.file.csv.hasHeaderRow),
  },
  'file.csv.rowsPerRecord': {
    id: 'file.csv.rowsPerRecord',
    type: 'checkbox',
    label: 'Multiple rows per record',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    defaultValue: r => !!(r && r.file && r.file.csv && r.file.csv.keyColumns),
  },
  'file.csv.keyColumns': {
    id: 'file.csv.keyColumns',
    type: 'filekeycolumn',
    label: 'Key columns',
    refreshOptionsOnChangesTo: [
      'file.csv.hasHeaderRow',
      'file.csv.columnDelimiter',
      'file.csv.rowDelimiter',
      'file.csv.trimSpaces',
      'file.csv.rowsToSkip',
      'file.csv.rowsPerRecord',
    ],
    sampleData: r => r && r.sampleData,
    visibleWhenAll: [
      { field: 'file.type', is: ['csv'] },
      {
        field: 'file.csv.rowsPerRecord',
        is: [true],
      },
    ],
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.keyColumns) || [],
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File has header',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.xlsx.rowsPerRecord': {
    type: 'checkbox',
    label: 'Multiple rows per record',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
    defaultValue: r => !!(r && r.file && r.file.xlsx && r.file.xlsx.keyColumns),
  },
  'file.xlsx.keyColumns': {
    type: 'filekeycolumn',
    label: 'Key columns',
    hasHeaderRow: r =>
      !!(r && r.file && r.file.xlsx && r.file.xlsx.hasHeaderRow),
    refreshOptionsOnChangesTo: ['file.xlsx.hasHeaderRow'],
    sampleData: r => r && r.sampleData,
    visibleWhenAll: [
      {
        field: 'file.xlsx.rowsPerRecord',
        is: [true],
      },
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
};
