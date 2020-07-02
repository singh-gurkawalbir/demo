import { MAX_DATA_LOADER_FILE_SIZE } from '../../../utils/constants';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };
    delete newValues['/file/csvHelper'];
    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};
    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }
    newValues['/file/output'] = 'records';
    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }
    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }
    delete newValues['/file/decompressFiles'];
    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.xlsx.keyColumns') {
      const keyColoumnField = fields.find(
        field => field.id === 'file.xlsx.keyColumns'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.xlsx.hasHeaderRow'
      );
      // resetting key columns when hasHeaderRow changes
      if (keyColoumnField.hasHeaderRow !== hasHeaderRowField.value) {
        keyColoumnField.value = [];
        keyColoumnField.hasHeaderRow = hasHeaderRowField.value;
      }
      return {
        hasHeaderRow: hasHeaderRowField.value,
      };
    }
    if (fieldId === 'uploadFile') {
      const fileType = fields.find(field => field.id === 'file.type');
      return fileType.value;
    }
    if (fieldId === 'file.csvHelper') {
      const keyColumnsField = fields.find(
        field => field.id === 'file.csv.keyColumns'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      return {
        fields: {
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          trimSpaces: trimSpacesField && trimSpacesField.value,
          rowsToSkip: rowsToSkipField && rowsToSkipField.value,
          hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
          keyColumns: keyColumnsField && keyColumnsField.value,
        },
      };
    }
    if (fieldId === 'file.csv.keyColumns') {
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      const options = {
        columnDelimiter: columnDelimiterField && columnDelimiterField.value,
        rowDelimiter: rowDelimiterField && rowDelimiterField.value,
        trimSpaces: trimSpacesField && trimSpacesField.value,
        rowsToSkip: rowsToSkipField && rowsToSkipField.value,
        hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
      };
      return options;
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    'file.type': {
      id: 'file.type',
      name: '/file/type',
      type: 'select',
      label: 'File type',
      defaultValue: r => (r && r.file && r.file.type) || '',
      options: [
        {
          items: [
            { label: 'CSV (or any delimited text file)', value: 'csv' },
            { label: 'JSON', value: 'json' },
            { label: 'XLSX', value: 'xlsx' },
            { label: 'XML', value: 'xml' },
          ],
        },
      ],
    },
    uploadFile: {
      id: 'uploadFile',
      name: '/uploadFile',
      type: 'uploadfile',
      placeholder: 'Upload the file to use',
      maxSize: MAX_DATA_LOADER_FILE_SIZE,
      mode: r => r && r.file && r.file.type,
      required: r => !r.rawData,
      refreshOptionsOnChangesTo: 'file.type',
      helpKey: 'export.uploadFile',
      visibleWhen: [{
        field: 'file.type',
        isNot: [''],
      }],
    },
    'file.csvHelper': {
      fieldId: 'file.csvHelper',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.trimSpaces': { fieldId: 'file.csv.trimSpaces' },
    'file.csv.rowsToSkip': { fieldId: 'file.csv.rowsToSkip' },
    'file.csv.hasHeaderRow': { fieldId: 'file.csv.hasHeaderRow' },
    'file.csv.rowsPerRecord': { fieldId: 'file.csv.rowsPerRecord' },
    'file.csv.keyColumns': { fieldId: 'file.csv.keyColumns' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    parsers: { fieldId: 'parsers' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'fixed.format': { fieldId: 'fixed.format' },
    'file.encoding': { fieldId: 'file.encoding' },
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'General',
            collapsed: false,
            fields: [
              'common',
            ],
          },
          {
            collapsed: true,
            label: 'How would you like to parse the file?',
            type: 'indent',
            fields: [
              'file.type',
              'uploadFile',
            ],
            containers: [
              {fields: [
                'file.xml.resourcePath',
                'parsers',
                'file.csvHelper',
                'file.csv.columnDelimiter',
                'file.csv.rowDelimiter',
                'file.csv.trimSpaces',
                'file.csv.rowsToSkip',
                'file.csv.hasHeaderRow',
                'file.csv.rowsPerRecord',
                'file.csv.keyColumns',
                'file.json.resourcePath',
                'file.xlsx.hasHeaderRow',
                'file.xlsx.rowsPerRecord',
                'file.xlsx.keyColumns'
              ]}
            ]
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['file.encoding', 'pageSize', 'dataURITemplate'],
          },
        ],
      },
      {
        fields: ['exportPanel'],
      }
    ]
  },
};
