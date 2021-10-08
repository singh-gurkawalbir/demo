import {
  updateFileProviderFormValues,
  EXPORT_FILE_FIELD_MAP,
  getFileProviderExportsOptionsHandler,
} from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    newValues['/type'] = 'webhook';

    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};

    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    return {
      ...newValues,
    };
  },
  optionsHandler: getFileProviderExportsOptionsHandler,
  fieldMap: {
    ...EXPORT_FILE_FIELD_MAP,
    advancedSettings: { formId: 'advancedSettings' },

  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'exportOneToMany'] },
      {
        collapsed: true,
        label: 'How would you like to parse files?',
        type: 'indent',
        fields: [
          'outputMode',
          'file.type',
          'uploadFile',
          'file.json.resourcePath',
          'file.xlsx.hasHeaderRow',
          'file.xlsx.rowsPerRecord',
          'file.xlsx.keyColumns',
          'edix12.format',
          'fixed.format',
          'edifact.format',
          'file.filedefinition.rules',
        ],
        containers: [{fields: [
          'parsers',
          'file.csv',
        ]}],
      },
      {
        collapsed: true,
        label: 'How would you like to group and sort records?',
        fields: [
          'file.sortByFields',
          'file.groupByFields',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
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
