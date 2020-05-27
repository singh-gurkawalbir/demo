import { isNewId } from '../../../../utils/resource';

export default {
  'salesforce.api': {
    type: 'radiogroupforresetfields',
    label: 'API type',
    required: true,
    fieldsToReset: [
      { id: 'salesforce.operation', type: 'radiogroupforresetfields' },
      { id: 'salesforce.compositeOperation', type: 'radiogroupforresetfields' },
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'SOAP(Recomended)', value: 'soap' },
          { label: 'REST', value: 'rest' },
          { label: 'Composite', value: 'compositerecord' },
        ],
      },
    ],
    defaultDisabled: r => {
      const isNew = isNewId(r._id);

      if (!isNew) return true;

      return false;
    },
  },
  'salesforce.document.id': {
    type: 'text',
    label: 'Document ID',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        is: ['update'],
      },
    ],
  },
  'salesforce.attachment.id': {
    type: 'text',
    label: 'Attachment ID',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        is: ['update'],
      },
    ],
  },
  'salesforce.document.name': {
    type: 'text',
    label: 'Document name',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.name': {
    type: 'text',
    label: 'Attachment name',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.description': {
    type: 'text',
    label: 'Description',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.document.folderId': {
    type: 'text',
    label: 'Folder ID',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.contentDocumentId': {
    type: 'text',
    label: 'Content document ID',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['contentVersion'],
      },
      {
        field: 'salesforce.blobOperation',
        is: ['update'],
      },
    ],
  },
  'salesforce.contentVersion.title': {
    type: 'text',
    label: 'Title',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['contentVersion'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.tagCsv': {
    type: 'text',
    label: 'Tag csv',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['contentVersion'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.contentLocation': {
    type: 'select',
    label: 'Content location',
    options: [
      {
        items: [
          { label: 'Salesforce', value: 'S' },
          { label: 'External', value: 'E' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['contentVersion'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.pathOnClient': {
    type: 'text',
    label: 'Path on client',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['contentVersion'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.parentId': {
    type: 'text',
    label: 'Parent ID',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.document.contentType': {
    type: 'text',
    label: 'Content type',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.contentType': {
    type: 'text',
    label: 'Content type',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.document.developerName': {
    type: 'text',
    label: 'Developer name',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.document.isInternalUseOnly': {
    type: 'checkbox',
    label: 'For internal use only?',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.document.isPublic': {
    type: 'checkbox',
    label: 'Is public document?',
    required: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['document'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.isPrivate': {
    type: 'checkbox',
    label: 'Is private?',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        is: ['attachment'],
      },
      {
        field: 'salesforce.blobOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.blobsObjectType': {
    type: 'select',
    label: 'SObject type',
    defaultValue: r => r && r.salesforce && r.salesforce.sObjectType,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    required: true,
    options: [
      {
        items: [
          { label: 'Attachment', value: 'attachment' },
          { label: 'Content Version', value: 'contentVersion' },
          { label: 'Document', value: 'document' },
        ],
      },
    ],
  },
  'salesforce.sObjectType': {
    label: 'SObject type',
    type: 'refreshableselect',
    filterKey: 'salesforce-sObjects',
    ignoreValidation: true,
    commMetaPath: r =>
      r && `salesforce/metadata/connections/${r._connectionId}/sObjectTypes`,
    connectionId: r => r && r._connectionId,
    required: true,
    placeholder: 'Please select a sObject type',
    helpKey: 'export.salesforce.sObjectType',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.blobOperation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    defaultValue: r => r && r.salesforce && r.salesforce.operation,
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'salesforce.operation': {
    type: 'radiogroupforresetfields',
    label: 'Operation',
    required: true,
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Insert/Update', value: 'addupdate' },
          { label: 'Upsert', value: 'upsert' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'salesforce.api',
        is: ['soap', 'rest'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    defaultValue: r => {
      if (r && r.salesforce && r.salesforce.api !== 'compositerecord') {
        return r.salesforce.operation;
      }

      return '';
    },
  },
  'salesforce.compositeOperation': {
    type: 'radiogroupforresetfields',
    label: 'Operation',
    required: true,
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Insert/Update', value: 'addupdate' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'salesforce.api',
        is: ['compositerecord'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    defaultValue: r => {
      if (r && r.salesforce && r.salesforce.api === 'compositerecord') {
        return r.salesforce.operation;
      }

      return '';
    },
  },
  'salesforce.idLookup.whereClause': {
    type: 'salesforcelookup',
    label: 'How can we find existing records?',
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate'],
      },
      {
        field: 'salesforce.compositeOperation',
        is: ['update', 'addupdate'],
      },
    ],
  },
  'salesforce.upsertpicklistvalues.fullName': {
    type: 'text',
    visible: false,
  },
  'salesforce.upsert.externalIdField': {
    type: 'refreshableselect',
    label: 'Which external ID field should be used to upsert?',
    filterKey: 'salesforce-externalIdFields',
    visibleWhenAll: [
      {
        field: 'salesforce.operation',
        is: ['upsert'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.idLookup.extract': {
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    skipExtractWrapOnSpecialChar: true,
    showLookup: false,
    label: 'Which export data field should map to external ID?',
    visibleWhenAll: [
      {
        field: 'salesforce.operation',
        is: ['upsert'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
