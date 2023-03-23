import { updateMappingsBasedOnNetSuiteSubrecords } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/netsuite/recordType'] = 'file';
      newValues['/distributed'] = false;
      newValues['/adaptorType'] = 'NetSuiteImport';
      newValues['/blob'] = true;
    } else {
      delete newValues['/blob'];
    }

    if (newValues['/netsuite_da/operation'] === 'add' && !newValues['/ignoreExisting']) {
      delete newValues['/netsuite_da/internalIdLookup/expression'];
      newValues['/netsuite_da/internalIdLookup'] = undefined;
    }

    const subrecords = newValues['/netsuite_da/subrecords'];

    const useSS2RestletsValue = newValues['/netsuite_da/restletVersion'];

    let mapping = newValues['/netsuite_da/mapping'];

    if (subrecords) {
      mapping = updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecords);
    }
    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }
    newValues['/mockResponse'] = safeParse(newValues['/mockResponse']);

    return {
      ...newValues,
      '/netsuite_da/subrecords': undefined,
      '/netsuite_da/mapping': mapping,
      '/netsuite_da/restletVersion': useSS2RestletsValue,
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
    blobKeyPath: { fieldId: 'blobKeyPath', deleteWhen: [{field: 'inputMode', isNot: ['blob']}] },
    distributed: { fieldId: 'distributed' },
    'netsuite_da.recordType': { fieldId: 'netsuite_da.recordType' },
    'netsuite_da.mapping': { fieldId: 'netsuite_da.mapping' },
    'netsuite_da.subrecords': { fieldId: 'netsuite_da.subrecords' },
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
        { field: 'netsuite_da.operation', is: ['update', 'delete'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'netsuite_da.internalIdLookup.expression': { fieldId: 'netsuite_da.internalIdLookup.expression' },
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
    'netsuite_da.restletVersion': {
      fieldId: 'netsuite_da.restletVersion',
    },
    traceKeyTemplate: {fieldId: 'traceKeyTemplate'},
    mockResponseSection: { formId: 'mockResponseSection' },
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
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'netsuite_da.restletVersion', 'blobKeyPath', 'idLockTemplate', 'dataURITemplate', 'netsuite_da.batchSize', 'traceKeyTemplate', 'apiIdentifier', 'deleteAfterImport'],
      },
    ],
  },
};
