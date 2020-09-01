import { MAX_DATA_LOADER_FILE_SIZE } from '../../../utils/constants';

export default {
  preSave: formValues => {
    // console.log(formValues);
    const newValues = { ...formValues };
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
      delete newValues['/parsers'];
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
      newValues['/file/xml/resourcePath'] = newValues['/parsers']?.resourcePath;
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
      delete newValues['/parsers'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/parsers'];
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
    const fileType = fields.find(field => field.id === 'file.type');

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
        fileType: fileType.value,
      };
    }
    if (fieldId === 'uploadFile') {
      return fileType.value;
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
    'file.csv': {
      fieldId: 'file.csv',
      uploadSampleDataFieldName: 'uploadFile',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    // 'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    parsers: {
      fieldId: 'parsers',
      uploadSampleDataFieldName: 'uploadFile',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xml'],
        },
      ],
    },
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
                // 'file.xml.resourcePath', // moved into 'parsers' input
                'parsers',
                'file.csv',
                'file.json.resourcePath',
                'file.xlsx.hasHeaderRow',
                'file.xlsx.rowsPerRecord',
                'file.xlsx.keyColumns',
              ]},
            ],
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
      },
    ],
  },
};
