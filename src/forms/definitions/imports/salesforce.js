import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/salesforce/sObjectType'] =
        newValues['/salesforce/blobsObjectType'];
      newValues['/salesforce/operation'] =
        newValues['/salesforce/blobsObjectType'] !== 'contentVersion'
          ? newValues['/salesforce/blobOperation'] : newValues['/salesforce/blobContentVersionOperation'];
    } else if (newValues['/salesforce/api'] === 'compositerecord') {
      newValues['/salesforce/operation'] =
        newValues['/salesforce/compositeOperation'];

      if (newValues['/salesforce/compositeOperation'] === 'insert') {
        newValues['/ignoreMissing'] = false;

        if (newValues['/ignoreExisting'] === false) {
          newValues['/salesforce/upsert'] = undefined;
          newValues['/salesforce/idLookup'] = undefined;
        }
      } else if (newValues['/salesforce/compositeOperation'] === 'update') {
        newValues['/ignoreExisting'] = false;
      } else {
        newValues['/ignoreMissing'] = false;
        newValues['/ignoreExisting'] = false;
      }
    } else if (
      newValues['/salesforce/api'] === 'soap' ||
      newValues['/salesforce/api'] === 'rest'
    ) {
      if (newValues['/salesforce/operation'] === 'insert') {
        newValues['/ignoreMissing'] = false;

        if (newValues['/ignoreExisting'] === false) {
          delete newValues['/salesforce/idLookup/whereClause'];
          delete newValues['/salesforce/idLookup/extract'];
          delete newValues['/salesforce/upsert/externalIdField'];
          newValues['/salesforce/upsert'] = undefined;
          newValues['/salesforce/idLookup'] = undefined;
        }
      } else if (['update', 'delete'].includes(newValues['/salesforce/operation'])) {
        newValues['/ignoreExisting'] = false;
        newValues['/salesforce/idLookup/extract'] = undefined;
        newValues['/salesforce/upsert/externalIdField'] = undefined;
      } else if (newValues['/salesforce/operation'] === 'addupdate') {
        newValues['/ignoreMissing'] = false;
        newValues['/ignoreExisting'] = false;
        newValues['/salesforce/idLookup/extract'] = undefined;
        newValues['/salesforce/upsert/externalIdField'] = undefined;
      } else {
        newValues['/ignoreMissing'] = false;
        newValues['/ignoreExisting'] = false;
        newValues['/salesforce/idLookup/whereClause'] = undefined;
      }
    }

    if (newValues['/inputMode'] !== 'blob') {
      delete newValues['/blob'];
    } else {
      newValues['/blob'] = true;
    }

    delete newValues['/inputMode'];
    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }
    newValues['/mockResponse'] = safeParse(newValues['/mockResponse']);

    return {
      ...newValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    apiType: {
      id: 'apiType',
      type: 'labeltitle',
      label: r => {
        if (r?.resourceType === 'transferFiles' || r?.blob) {
          return 'Where would you like to transfer the files?';
        }

        return 'Where would you like to import the records?';
      },
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
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
    'salesforce.api': { fieldId: 'salesforce.api' },
    'salesforce.document.id': { fieldId: 'salesforce.document.id' },
    'salesforce.attachment.id': { fieldId: 'salesforce.attachment.id' },

    'salesforce.document.name': { fieldId: 'salesforce.document.name' },
    'salesforce.attachment.name': { fieldId: 'salesforce.attachment.name' },

    'salesforce.attachment.parentId': {
      fieldId: 'salesforce.attachment.parentId',
    },
    'salesforce.document.contentType': {
      fieldId: 'salesforce.document.contentType',
    },
    'salesforce.attachment.contentType': {
      fieldId: 'salesforce.attachment.contentType',
    },

    'salesforce.document.developerName': {
      fieldId: 'salesforce.document.developerName',
    },
    'salesforce.document.isInternalUseOnly': {
      fieldId: 'salesforce.document.isInternalUseOnly',
    },
    'salesforce.document.isPublic': {
      fieldId: 'salesforce.document.isPublic',
    },
    'salesforce.attachment.description': {
      fieldId: 'salesforce.attachment.description',
    },
    'salesforce.document.folderId': { fieldId: 'salesforce.document.folderId' },
    'salesforce.contentVersion.contentDocumentId': {
      fieldId: 'salesforce.contentVersion.contentDocumentId',
    },
    'salesforce.contentVersion.title': {
      fieldId: 'salesforce.contentVersion.title',
    },

    'salesforce.contentVersion.tagCsv': {
      fieldId: 'salesforce.contentVersion.tagCsv',
    },
    'salesforce.contentVersion.contentLocation': {
      fieldId: 'salesforce.contentVersion.contentLocation',
    },
    'salesforce.contentVersion.pathOnClient': {
      fieldId: 'salesforce.contentVersion.pathOnClient',
    },
    'salesforce.sObjectType': { fieldId: 'salesforce.sObjectType' },
    blobKeyPath: {
      fieldId: 'blobKeyPath',
      deleteWhen: [{field: 'inputMode', isNot: ['blob']}],
    },
    'salesforce.operation': { fieldId: 'salesforce.operation' },
    'salesforce.compositeOperation': {
      fieldId: 'salesforce.compositeOperation',
    },
    'salesforce.idLookup.extract': { fieldId: 'salesforce.idLookup.extract',
      deleteWhenAll: [
        { field: 'salesforce.compositeOperation', is: ['insert'] },
        { field: 'ignoreExisting', is: ['false'] },
      ] },
    'salesforce.blobsObjectType': { fieldId: 'salesforce.blobsObjectType', removeWhen: [{field: 'salesforce.api', is: ['compositerecord']}] },
    'salesforce.blobOperation': { fieldId: 'salesforce.blobOperation', removeWhen: [{field: 'salesforce.api', is: ['compositerecord']}] },
    'salesforce.blobContentVersionOperation': {fieldId: 'salesforce.blobContentVersionOperation'},
    'salesforce.attachment.isPrivate': {
      fieldId: 'salesforce.attachment.isPrivate',
    },
    'salesforce.idLookup.whereClause': { fieldId: 'salesforce.idLookup.whereClause',
      deleteWhenAll: [
        { field: 'salesforce.compositeOperation', is: ['insert'] },
        { field: 'ignoreExisting', is: ['false'] },
      ] },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      label: 'Ignore existing records',
      visibleWhen: [
        { field: 'salesforce.operation', is: ['insert'] },
        { field: 'salesforce.compositeOperation', is: ['insert'] },
      ],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      label: 'Ignore missing records',
      visibleWhen: [
        { field: 'salesforce.operation', is: ['update', 'delete'] },
        { field: 'salesforce.compositeOperation', is: ['update'] },
      ],
    },
    'salesforce.upsertpicklistvalues.fullName': {
      fieldId: 'salesforce.upsertpicklistvalues.fullName',
    },
    'salesforce.upsert.externalIdField': {
      fieldId: 'salesforce.upsert.externalIdField',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      deleteWhenAll: [
        { field: 'salesforce.compositeOperation', is: ['insert'] },
        { field: 'ignoreExisting', is: ['false'] },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
        },
      ],
    },
    'salesforce.lookups': {
      fieldId: 'salesforce.lookups',
      visible: false,
    },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    mockResponseSection: {formId: 'mockResponseSection'},
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
        label: 'How would you like the records imported?',
        fields: [
          'salesforce.api',
          'salesforce.lookups',
          'salesforce.sObjectType',
          'salesforce.operation',
          'salesforce.blobsObjectType',
          'salesforce.blobOperation',
          'salesforce.blobContentVersionOperation',
          'salesforce.attachment.id',
          'salesforce.attachment.name',
          'salesforce.attachment.parentId',
          'salesforce.attachment.contentType',
          'salesforce.attachment.description',
          'salesforce.attachment.isPrivate',
          'salesforce.document.id',
          'salesforce.document.name',
          'salesforce.document.folderId',
          'salesforce.document.contentType',
          'salesforce.document.developerName',
          'salesforce.document.isInternalUseOnly',
          'salesforce.document.isPublic',
          'salesforce.contentVersion.contentDocumentId',
          'salesforce.contentVersion.title',
          'salesforce.contentVersion.pathOnClient',
          'salesforce.contentVersion.tagCsv',
          'salesforce.contentVersion.contentLocation',
          'salesforce.compositeOperation',
          'ignoreExisting',
          'ignoreMissing',
          'salesforce.idLookup.whereClause',
          'salesforce.upsert.externalIdField',
          'salesforce.idLookup.extract',
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
          'blobKeyPath', 'advancedSettings', 'deleteAfterImport'],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'salesforce.upsert.externalIdField') {
      const sObjectTypeField = fields.find(
        field => field.id === 'salesforce.sObjectType'
      );

      return {
        disableFetch: !(sObjectTypeField && sObjectTypeField.value),
        commMetaPath: sObjectTypeField
          ? `salesforce/metadata/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}`
          : '',
        resetValue: '',
      };
    }

    return null;
  },
};
