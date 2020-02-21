import { keyBy } from 'lodash';
import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/netsuite/recordType'] = 'file';
      newValues['/distributed'] = false;
      newValues['/adaptorType'] = 'NetSuiteImport';
    }

    const subrecords = newValues['/netsuite_da/subrecords'];
    let mapping = newValues['/netsuite_da/mapping'];

    if (subrecords) {
      const subrecordsMap = keyBy(subrecords, 'fieldId');

      if (mapping) {
        if (mapping.fields) {
          mapping.fields = mapping.fields
            .map(fld => {
              if (subrecordsMap[fld.generate]) {
                // eslint-disable-next-line no-param-reassign
                fld.subRecordMapping.recordType =
                  subrecordsMap[fld.generate].recordType;
                // eslint-disable-next-line no-param-reassign
                fld.subRecordMapping.jsonPath =
                  subrecordsMap[fld.generate].jsonPath;
                subrecordsMap[fld.generate].updated = true;
              }

              return fld;
            })
            .filter(
              fld =>
                !fld.subRecordMapping ||
                !fld.subRecordMapping.recordType ||
                subrecordsMap[fld.generate]
            );
        }

        if (mapping.lists) {
          mapping.lists = mapping.lists
            .map(list => {
              if (list.fields) {
                // eslint-disable-next-line no-param-reassign
                list.fields = list.fields.map(fld => {
                  const fieldId = `${list.generate}[*].${fld.generate}`;

                  if (subrecordsMap[fieldId]) {
                    // eslint-disable-next-line no-param-reassign
                    fld.subRecordMapping.recordType =
                      subrecordsMap[fieldId].recordType;
                    // eslint-disable-next-line no-param-reassign
                    fld.subRecordMapping.jsonPath =
                      subrecordsMap[fieldId].jsonPath;
                    subrecordsMap[fieldId].updated = true;
                  }

                  return fld;
                });
              }

              return list;
            })
            .map(list => {
              if (list.fields) {
                // eslint-disable-next-line no-param-reassign
                list.fields = list.fields.filter(
                  fld =>
                    !fld.subRecordMapping ||
                    !fld.subRecordMapping.recordType ||
                    subrecordsMap[`${list.generate}[*].${fld.generate}`]
                );
              }

              return list;
            });
        }
      }

      const newSubrecords = Object.keys(subrecordsMap)
        .map(fieldId => subrecordsMap[fieldId])
        .filter(sr => !sr.updated);

      if (newSubrecords.length > 0) {
        if (!mapping) {
          mapping = {};
        }

        if (!mapping.fields) {
          mapping.fields = [];
        }

        if (!mapping.lists) {
          mapping.lists = [];
        }

        newSubrecords.forEach(sr => {
          if (sr.fieldId.includes('[*].')) {
            const [listId, fieldId] = sr.fieldId.split('[*].');
            let listIndex = mapping.lists.findIndex(l => l.generate === listId);

            if (listIndex === -1) {
              mapping.lists.push({ generate: listId });
              listIndex = mapping.lists.length - 1;
            }

            const list = mapping.lists[listIndex];

            if (!list.fields) {
              list.fields = [];
            }

            list.fields.push({
              generate: fieldId,
              subRecordMapping: {
                recordType: sr.recordType,
                jsonPath: sr.jsonPath,
              },
            });
          } else {
            mapping.fields.push({
              generate: sr.fieldId,
              subRecordMapping: {
                recordType: sr.recordType,
                jsonPath: sr.jsonPath,
              },
            });
          }
        });
      }
    }

    return {
      ...newValues,
      '/netsuite_da/subrecords': undefined,
      '/netsuite_da/mapping': mapping,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    inputMode: {
      id: 'inputMode',
      type: 'mode',
      label: 'Input Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => (r && r.blobKeyPath ? 'blob' : 'records'),
    },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    distributed: { fieldId: 'distributed' },
    'netsuite_da.recordType': { fieldId: 'netsuite_da.recordType' },
    'netsuite_da.mapping': { fieldId: 'netsuite_da.mapping' },
    'netsuite_da.subrecords': {
      fieldId: 'netsuite_da.subrecords',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
    },
    'netsuite_da.operation': { fieldId: 'netsuite_da.operation' },
    'netsuite.file.internalId': { fieldId: 'netsuite.file.internalId' },
    'netsuite.file.name': { fieldId: 'netsuite.file.name' },
    'netsuite.file.fileType': { fieldId: 'netsuite.file.fileType' },
    'netsuite.file.folder': { fieldId: 'netsuite.file.folder' },
    'netsuite.operation': { fieldId: 'netsuite.operation' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhenAll: [
        { field: 'netsuite_da.operation', is: ['add'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhenAll: [
        { field: 'netsuite_da.operation', is: ['update'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'netsuite_da.internalIdLookup.expression': {
      fieldId: 'netsuite_da.internalIdLookup.expression',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
    },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      'distributed',
      'netsuite_da.recordType',
      'netsuite_da.mapping',
      'netsuite_da.subrecords',
      'netsuite_da.operation',
      'netsuite.operation',
      'ignoreExisting',
      'ignoreMissing',
      'netsuite_da.internalIdLookup.expression',
      'netsuite.file.internalId',
      'netsuite.file.name',
      'netsuite.file.fileType',
      'netsuite.file.folder',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings', 'deleteAfterImport'],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite_da.internalIdLookup.expression') {
      const recordTypeField = fields.find(
        field => field.id === 'netsuite_da.recordType'
      );

      return {
        disableFetch: !(recordTypeField && recordTypeField.value),
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
          : '',
        resetValue: [],
      };
    }

    if (fieldId === 'netsuite_da.subrecords') {
      const recordTypeField = fields.find(
        field => field.id === 'netsuite_da.recordType'
      );

      window.recordTypeField = recordTypeField;

      return {
        recordType: recordTypeField && recordTypeField.value,
      };
    }

    return null;
  },
};
