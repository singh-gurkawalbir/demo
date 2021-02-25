import { updateMappingsBasedOnNetSuiteSubrecords } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/netsuite/recordType'] = 'file';
      newValues['/distributed'] = false;
      newValues['/adaptorType'] = 'NetSuiteImport';
      newValues['/blob'] = true;
    } else {
      delete newValues['/blobKeyPath'];
      delete newValues['/blob'];
    }

    if (newValues['/netsuite_da/operation'] === 'add' && !newValues['/ignoreExisting']) {
      delete newValues['/netsuite_da/internalIdLookup/expression'];
      newValues['/netsuite_da/internalIdLookup'] = undefined;
    }

    const subrecords = newValues['/netsuite_da/useSS2Restlets'] === 'true' ? [] : newValues['/netsuite_da/subrecords'];

    const useSS2RestletsValue = newValues['/netsuite_da/useSS2Restlets'] === 'true';

    let mapping = newValues['/netsuite_da/mapping'];

    if (subrecords) {
      mapping = updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecords);
    }

    return {
      ...newValues,
      '/netsuite_da/subrecords': undefined,
      '/netsuite_da/mapping': mapping,
      '/netsuite_da/useSS2Restlets': useSS2RestletsValue,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    inputMode: {
      id: 'inputMode',
      type: 'mode',
      label: 'Input mode',
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'transferFiles' || r.blob) return 'blob';

        return 'records';
      },
    },
    'netsuite_da.batchSize': {
      fieldId: 'netsuite_da.batchSize',
    },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    distributed: { fieldId: 'distributed' },
    'netsuite_da.recordType': { fieldId: 'netsuite_da.recordType' },
    'netsuite_da.mapping': { fieldId: 'netsuite_da.mapping' },
    'netsuite_da.subrecords': {
      fieldId: 'netsuite_da.subrecords',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
    },
    'netsuite_da.operation': {
      fieldId: 'netsuite_da.operation',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
    },
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
        { field: 'netsuite_da.operation', is: ['update', 'delete'] },
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
    idLockTemplate: {
      fieldId: 'idLockTemplate',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhenA: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    apiIdentifier: {
      fieldId: 'apiIdentifier',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ] },
    settings: { fieldId: 'settings' },
    'netsuite_da.useSS2Restlets': {
      fieldId: 'netsuite_da.useSS2Restlets',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'inputMode', 'dataMappings'],
      },
      {
        collapsed: true,
        label: r => {
          if (r?.resourceType === 'transferFiles' || r?.blob) {
            return 'How would you like the files transferred?';
          }

          return 'How would you like the records imported?';
        },
        fields: [
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
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'netsuite_da.useSS2Restlets', 'blobKeyPath', 'idLockTemplate', 'dataURITemplate', 'netsuite_da.batchSize', 'apiIdentifier', 'deleteAfterImport'],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const recordTypeField = fields.find(
      field => field.id === 'netsuite_da.recordType'
    );

    if (fieldId === 'netsuite_da.internalIdLookup.expression') {
      return {
        disableFetch: !(recordTypeField?.value),
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
          : '',
        resetValue: [],
      };
    }

    if (fieldId === 'netsuite_da.subrecords') {
      return {
        recordType: recordTypeField?.value,
      };
    }

    if (fieldId === 'netsuite_da.operation') {
      return {
        recordType: recordTypeField?.value,
        commMetaPath: recordTypeField ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes` : '',
      };
    }

    return null;
  },
};
