export default {
  'salesforce.api': {
    type: 'radiogroup',
    label: 'API Type',
    required: true,
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
  },
  'salesforce.document.id': {
    type: 'text',
    label: 'Document Id',
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
    label: 'Attachment Id',
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
    label: 'Document Name',
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
    label: 'Attachment Name',
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
    label: 'Folder Id',
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
    label: 'Content Document Id',
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
    label: 'Tag CSV',
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
    label: 'Content Location',
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
    label: 'Path On Client',
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
    label: 'Parent Id',
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
    label: 'Content Type',
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
    label: 'Content Type',
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
    label: 'Developer Name',
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
    label: 'For Internal Use Only?',
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
    label: 'Is Public Document?',
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
    label: 'Is Private?',
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
  'salesforce.blobsObjectType': {
    type: 'select',
    label: 'SObject Type',
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
    label: 'SObject Type',
    type: 'refreshableselect',
    filterKey: 'salesforce-sObjects',
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
    type: 'radiogroup',
    label: 'Operation',
    required: true,
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
  },
  'salesforce.compositeOperation': {
    type: 'radiogroup',
    label: 'Operation',
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
    defaultValue: r => r && r.salesforce && r.salesforce.operation,
  },
  'salesforce.idLookup.extract': {
    type: 'text',
    label: 'How can we find existing records?',
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.idLookup.whereClause': {
    type: 'text',
    label: 'Where Clause',
    visibleWhenAll: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'salesforce.operation',
        is: ['update', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'salesforce.upsertpicklistvalues.fullName': {
    type: 'select',
    label: 'Which External ID field should be used to Upsert?',
    options: [
      {
        // To do replace statistically instead of dynamic
        items: [
          { label: 'AccountID', value: 'accountid' },
          { label: 'CustomerID', value: 'customerid' },
        ],
      },
    ],
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
  'salesforce.upsert.externalIdField': {
    type: 'text',
    label: 'Which export data field should map to External ID?',
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
