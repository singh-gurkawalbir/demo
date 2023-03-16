import { safeParse } from '../../../utils/string';
import { updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;
      const fileType = fields.find(field => field.id === 'file.type');

      // Fetch format specific Field Definition field to fetch id
      if (fileType.value === 'filedefinition') definitionFieldId = 'edix12.format';
      else if (fileType.value === 'fixed') definitionFieldId = 'fixed.format';
      else definitionFieldId = 'edifact.format';
      const definition = fields.find(field => field.id === definitionFieldId);

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
      };
    }
    if (fieldId === 'dataURITemplate') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }

    return null;
  },
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }
    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    delete newValues['/file/compressFiles'];
    newValues['/file/skipAggregation'] = true;
    newValues['/mockResponse'] = safeParse(newValues['/mockResponse']);

    return {
      ...newValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    distributed: { fieldId: 'distributed', defaultValue: false },

    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx.includeHeader': { fieldId: 'file.xlsx.includeHeader' },
    'as2.fileNameTemplate': { fieldId: 'as2.fileNameTemplate' },
    'as2.messageIdTemplate': { fieldId: 'as2.messageIdTemplate' },
    'as2.headers': { fieldId: 'as2.headers' },
    dataMappings: { formId: 'dataMappings' },
    compressFiles: { formId: 'compressFiles' },
    'as2.maxRetries': { fieldId: 'as2.maxRetries' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
    'file.type': { fieldId: 'file.type' },
    'edifact.format': { fieldId: 'edifact.format' },
    'fixed.format': { fieldId: 'fixed.format' },
    'edix12.format': { fieldId: 'edix12.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.type',
      ],
      required: true,
    },
    'file.xml.body': {
      id: 'file.xml.body',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'XML document',
      refreshOptionsOnChangesTo: ['file.type'],
      required: true,
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xml'],
        },
      ],
    },
    'file.json.body': {
      id: 'file.json.body',
      type: 'httprequestbody',
      label: 'JSON document',
      refreshOptionsOnChangesTo: ['file.type'],
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['json'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    traceKeyTemplate: {fieldId: 'traceKeyTemplate'},
    mockResponseSection: {formId: 'mockResponseSection'},
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        type: 'indent',
        fields: [
          'distributed',
          'file.type',
          'edifact.format',
          'fixed.format',
          'edix12.format',
          'as2.fileNameTemplate',
          'as2.messageIdTemplate',
          'file.xml.body',
          'file.json.body',
          'file.xlsx.includeHeader',
          'file.filedefinition.rules',
          'as2.headers',
          'file.lookups',
        ],
        containers: [{fields: [
          'file.csv',
        ]}],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['compressFiles', 'as2.maxRetries', 'traceKeyTemplate'],
      },
    ],
  },
  actions: [
    {
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'file.type',
          isNot: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      // Button that saves file defs and then submit resource
      id: 'savefiledefinitions',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
  ],
};
