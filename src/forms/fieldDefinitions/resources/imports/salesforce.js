import { isNewId } from '../../../../utils/resource';

export default {
  'salesforce.api': {
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
        isNot: ['', 'update'],
      },
    ],
  },
  'salesforce.document.contentType': {
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
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
