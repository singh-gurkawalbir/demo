export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };
    const lookup =
      resource.rest &&
      resource.rest.lookups &&
      resource.rest.lookups.get(retValues['/rest/existingDataId']);

    if (retValues['/rest/method'] === 'COMPOSITE') {
      if (retValues['/rest/compositeType'] === 'CREATE_AND_UPDATE') {
        retValues['/rest/relativeURI'] = [
          retValues['/rest/relativeURIUpdate'],
          retValues['/rest/relativeURICreate'],
        ];
        retValues['/rest/method'] = [
          retValues['/rest/compositeMethodUpdate'],
          retValues['/rest/compositeMethodCreate'],
        ];

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

        if (
          retValues['/rest/responseIdPathCreate'] ||
          retValues['/rest/responseIdPathUpdate']
        ) {
          retValues['/rest/responseIdPath'] = [
            retValues['/rest/responseIdPathUpdate'],
            retValues['/rest/responseIdPathCreate'],
          ];
        }

        if (
          retValues['/rest/successPathCreate'] ||
          retValues['/rest/successPathUpdate']
        ) {
          retValues['/rest/successPath'] = [
            retValues['/rest/successPathUpdate'],
            retValues['/rest/successPathCreate'],
          ];
        }

        if (
          retValues['/rest/successValuesCreate'] ||
          retValues['/rest/successValuesUpdate']
        ) {
          retValues['/rest/successValues'] = [
            retValues['/rest/successValuesUpdate'],
            retValues['/rest/successValuesCreate'],
          ];
        }

        retValues['/rest/body'] = [
          retValues['/rest/bodyUpdate'],
          retValues['/rest/bodyCreate'],
        ];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = false;
      } else if (
        retValues['/rest/compositeType'] === 'CREATE_AND_IGNORE_EXISTING'
      ) {
        retValues['/rest/relativeURI'] = [retValues['/rest/relativeURICreate']];
        retValues['/rest/method'] = [retValues['/rest/compositeMethodCreate']];

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

        if (retValues['/rest/responseIdPathCreate']) {
          retValues['/rest/responseIdPath'] = [
            retValues['/rest/responseIdPathCreate'],
          ];
        }

        retValues['/rest/body'] = [retValues['/rest/bodyCreate']];

        retValues['/ignoreExisting'] = true;
        retValues['/ignoreMissing'] = false;

        if (lookup) {
          retValues['/rest/ignoreLookupName'] =
            retValues['/rest/existingDataId'];
        } else {
          retValues['/rest/ignoreExtract'] = retValues['/rest/existingDataId'];
        }

        if (retValues['/rest/successPathCreate']) {
          retValues['/rest/successPath'] = [
            retValues['/rest/successPathCreate'],
          ];
        }

        if (retValues['/rest/successValuesCreate']) {
          retValues['/rest/successValues'] = [
            retValues['/rest/successValuesCreate'],
          ];
        }
      } else if (retValues['/rest/compositeType'] === 'UPDATE_AND_IGNORE_NEW') {
        retValues['/rest/relativeURI'] = [retValues['/rest/relativeURIUpdate']];
        retValues['/rest/method'] = [retValues['/rest/compositeMethodUpdate']];

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

        if (retValues['/rest/responseIdPathUpdate']) {
          retValues['/rest/responseIdPath'] = [
            retValues['/rest/responseIdPathUpdate'],
          ];
        }

        if (retValues['/rest/successPathUpdate']) {
          retValues['/rest/successPath'] = [
            retValues['/rest/successPathUpdate'],
          ];
        }

        if (retValues['/rest/successValuesUpdate']) {
          retValues['/rest/successValues'] = [
            retValues['/rest/successValuesUpdate'],
          ];
        }

        retValues['/rest/body'] = [retValues['/rest/bodyUpdate']];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = true;

        if (lookup) {
          retValues['/rest/ignoreLookupName'] =
            retValues['/rest/existingDataId'];
        } else {
          retValues['/rest/ignoreExtract'] = retValues['/rest/existingDataId'];
        }
      }
    } else {
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
      retValues['/rest/body'] = [retValues['/rest/bodyUpdate']];
    }

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'rest.body') {
      const lookupField = fields.find(
        field => field.fieldId === 'rest.lookups'
      );

      if (lookupField) {
        return {
          lookupId: 'rest.lookups',
          lookups: lookupField && lookupField.value,
        };
      }
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'rest.method': { fieldId: 'rest.method' },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.compositeType': { fieldId: 'rest.compositeType' },
    'rest.lookups': { fieldId: 'rest.lookups', visible: false },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.body': { fieldId: 'rest.body' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    'rest.responseIdPath': { fieldId: 'rest.responseIdPath' },
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create New Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
      ],
    },
    'rest.compositeMethodCreate': { fieldId: 'rest.compositeMethodCreate' },
    'rest.relativeURICreate': { fieldId: 'rest.relativeURICreate' },
    'rest.bodyCreate': { fieldId: 'rest.bodyCreate' },
    'rest.successPathCreate': { fieldId: 'rest.successPathCreate' },
    'rest.successValuesCreate': { fieldId: 'rest.successValuesCreate' },
    'rest.responseIdPathCreate': { fieldId: 'rest.responseIdPathCreate' },
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate Existing Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
      ],
    },
    'rest.compositeMethodUpdate': { fieldId: 'rest.compositeMethodUpdate' },
    'rest.relativeURIUpdate': { fieldId: 'rest.relativeURIUpdate' },
    'rest.bodyUpdate': { fieldId: 'rest.bodyUpdate' },
    'rest.successPathUpdate': { fieldId: 'rest.successPathUpdate' },
    'rest.successValuesUpdate': { fieldId: 'rest.successValuesUpdate' },
    'rest.responseIdPathUpdate': { fieldId: 'rest.responseIdPathUpdate' },
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore Existing Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandignore', 'updateandignore'],
        },
      ],
    },
    'rest.existingDataId': { fieldId: 'rest.existingDataId' },
    sampleData: {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    'rest.sampleData': { fieldId: 'rest.sampleData' },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'rest.method',
      'rest.headers',
      'rest.compositeType',
      'rest.lookups',
      // 'mapping',
      'rest.relativeURI',
      'rest.body',
      'rest.successPath',
      'rest.successValues',
      'rest.responseIdPath',
      'createNewData',
      'rest.compositeMethodCreate',
      'rest.relativeURICreate',
      'rest.bodyCreate',
      'rest.successPathCreate',
      'rest.successValuesCreate',
      'rest.responseIdPathCreate',
      'upateExistingData',
      'rest.compositeMethodUpdate',
      'rest.relativeURIUpdate',
      'rest.bodyUpdate',
      'rest.successPathUpdate',
      'rest.successValuesUpdate',
      'rest.responseIdPathUpdate',
      'ignoreExistingData',
      'rest.existingDataId',
      'sampleData',
      'rest.sampleData',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
