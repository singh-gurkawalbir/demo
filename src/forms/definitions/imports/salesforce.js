import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/salesforce/sObjectType'] =
        newValues['/salesforce/blobsObjectType'];
      newValues['/salesforce/operation'] =
        newValues['/salesforce/blobOperation'];
    } else if (newValues['/salesforce/api'] === 'compositerecord') {
      newValues['/salesforce/operation'] =
        newValues['/salesforce/compositeOperation'];
    }

    delete newValues['/inputMode'];

    return {
      ...newValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    apiType: {
      id: 'apiType',
      type: 'labeltitle',
      label: 'Where would you like to import the data?',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    inputMode: {
      id: 'inputMode',
      type: 'radiogroup',
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
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'salesforce.sObjectType': { fieldId: 'salesforce.sObjectType' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'salesforce.operation': { fieldId: 'salesforce.operation' },
    'salesforce.compositeOperation': {
      fieldId: 'salesforce.compositeOperation',
    },
    'salesforce.idLookup.extract': { fieldId: 'salesforce.idLookup.extract' },
    'salesforce.blobsObjectType': { fieldId: 'salesforce.blobsObjectType' },
    'salesforce.blobOperation': { fieldId: 'salesforce.blobOperation' },
    'salesforce.attachment.isPrivate': {
      fieldId: 'salesforce.attachment.isPrivate',
    },
    'salesforce.idLookup.whereClause': {
      fieldId: 'salesforce.idLookup.whereClause',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
    },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [{ field: 'salesforce.operation', is: ['insert'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhenAll: [
        { field: 'salesforce.operation', is: ['update'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'salesforce.upsertpicklistvalues.fullName': {
      fieldId: 'salesforce.upsertpicklistvalues.fullName',
    },
    'salesforce.upsert.externalIdField': {
      fieldId: 'salesforce.upsert.externalIdField',
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
    mapping: {
      fieldId: 'mapping',
      refreshOptionsOnChangesTo: [
        'salesforce.sObjectType',
        'salesforce.lookups',
      ],
    },
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
      'apiType',
      'salesforce.api',
      'importData',
      'blobKeyPath',
      'salesforce.lookups',
      'salesforce.sObjectType',
      'salesforce.operation',
      'salesforce.blobsObjectType',
      'salesforce.blobOperation',
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
    if (fieldId === 'salesforce.idLookup.whereClause') {
      const sObjectTypeField = fields.find(
        field => field.id === 'salesforce.sObjectType'
      );

      return {
        disableFetch: !(sObjectTypeField && sObjectTypeField.value),
        commMetaPath: sObjectTypeField
          ? `salesforce/metadata/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}`
          : '',
        resetValue: [],
      };
    }

    return null;
  },
};
