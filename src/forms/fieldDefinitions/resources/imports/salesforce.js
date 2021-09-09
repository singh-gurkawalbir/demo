import { isNewId } from '../../../../utils/resource';

export default {
  'salesforce.api': {
    type: 'radiogroupforresetfields',
    label: 'Salesforce API type',
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
          { label: 'SOAP (recommended)', value: 'soap' },
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
    type: 'uri',
    label: 'Document ID',
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Attachment ID',
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Document name',
    required: true,
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Attachment name',
    required: true,
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Folder ID',
    required: true,
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Content document ID',
    showExtract: false,
    showLookup: false,
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
        field: 'salesforce.blobContentVersionOperation',
        isNot: ['insert'],
      },
    ],
  },
  'salesforce.contentVersion.title': {
    type: 'uri',
    label: 'Title',
    showExtract: false,
    showLookup: false,
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
        field: 'salesforce.blobContentVersionOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.tagCsv': {
    type: 'uri',
    label: 'Tag csv',
    showExtract: false,
    showLookup: false,
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
        field: 'salesforce.blobContentVersionOperation',
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
        field: 'salesforce.blobContentVersionOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.contentVersion.pathOnClient': {
    type: 'uri',
    label: 'Path on client',
    showExtract: false,
    showLookup: false,
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
        field: 'salesforce.blobContentVersionOperation',
        isNot: [''],
      },
    ],
  },
  'salesforce.attachment.parentId': {
    type: 'uri',
    label: 'Parent ID',
    required: true,
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Content type',
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    label: 'Content type',
    showExtract: false,
    showLookup: false,
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
    type: 'uri',
    showExtract: false,
    showLookup: false,
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
    label: 'sObject type',
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
    label: 'sObject type',
    type: 'refreshableselect',
    filterKey: 'salesforce-sObjects',
    ignoreValidation: true,
    commMetaPath: r =>
      r && `salesforce/metadata/connections/${r._connectionId}/sObjectTypes`,
    connectionId: r => r && r._connectionId,
    required: true,
    placeholder: 'Please select an sObject type',
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
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
      {
        field: 'salesforce.blobsObjectType',
        isNot: ['contentVersion'],
      },
    ],
  },
  'salesforce.blobContentVersionOperation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    defaultValue: r => r && r.salesforce && r.salesforce.operation,
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Upsert', value: 'upsert' },
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
          { label: 'Delete', value: 'delete'},
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
      if (r && r.salesforce && r.salesforce.api !== 'compositerecord' && !r.blob) {
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
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate', 'delete'],
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
