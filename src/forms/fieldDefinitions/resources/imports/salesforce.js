export default {
  'salesforce.operation': {
    type: 'select',
    label: 'Salesforce operation',
    options: [
      {
        items: [
          { label: 'Insert', value: 'insert' },
          { label: 'Update', value: 'update' },
          { label: 'Upsert', value: 'upsert' },
          { label: 'Upsertpicklistvalues', value: 'upsertpicklistvalues' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'salesforce.api': {
    type: 'select',
    label: 'Salesforce api',
    options: [
      {
        items: [
          { label: 'Rest', value: 'rest' },
          { label: 'Soap', value: 'soap' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'Compositerecord', value: 'compositerecord' },
        ],
      },
    ],
  },
  'salesforce.soap.headers.allOrNone': {
    type: 'checkbox',
    label: 'Salesforce soap headers all Or None',
    defaultValue: false,
  },
  'salesforce.soap.batchSize': {
    type: 'text',
    label: 'Salesforce soap batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'salesforce.sObjectType': {
    type: 'text',
    label: 'Salesforce s Object Type',
  },
  'salesforce.idLookup.extract': {
    type: 'text',
    label: 'Salesforce id Lookup extract',
  },
  'salesforce.idLookup.whereClause': {
    type: 'text',
    label: 'Salesforce id Lookup where Clause',
  },
  'salesforce.upsert.externalIdField': {
    type: 'text',
    label: 'Salesforce upsert external Id Field',
  },
  'salesforce.upsertpicklistvalues.fullName': {
    type: 'text',
    label: 'Salesforce upsertpicklistvalues full Name',
  },
  'salesforce.upsertpicklistvalues.visibleLines': {
    type: 'text',
    label: 'Salesforce upsertpicklistvalues visible Lines',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'salesforce.removeNonSubmittableFields': {
    type: 'checkbox',
    label: 'Salesforce remove Non Submittable Fields',
    defaultValue: false,
  },
  'salesforce.lookups[*].allowFailures': {
    type: 'text',
    label: 'Salesforce lookups[*] allow Failures',
  },
  'salesforce.lookups[*].name': {
    type: 'text',
    label: 'Salesforce lookups[*] name',
  },
  'salesforce.lookups[*].map': {
    type: 'text',
    label: 'Salesforce lookups[*] map',
  },
  'salesforce.lookups[*].default': {
    type: 'text',
    label: 'Salesforce lookups[*] default',
  },
  'salesforce.lookups[*].sObjectType': {
    type: 'text',
    label: 'Salesforce lookups[*] s Object Type',
  },
  'salesforce.lookups[*].resultField': {
    type: 'text',
    label: 'Salesforce lookups[*] result Field',
  },
  'salesforce.lookups[*].whereClause': {
    type: 'text',
    label: 'Salesforce lookups[*] where Clause',
  },
  'salesforce.document.id': {
    type: 'text',
    label: 'Salesforce document id',
  },
  'salesforce.document.name': {
    type: 'text',
    label: 'Salesforce document name',
  },
  'salesforce.document.folderId': {
    type: 'text',
    label: 'Salesforce document folder Id',
  },
  'salesforce.document.contentType': {
    type: 'text',
    label: 'Salesforce document content Type',
  },
  'salesforce.document.developerName': {
    type: 'text',
    label: 'Salesforce document developer Name',
  },
  'salesforce.document.isInternalUseOnly': {
    type: 'checkbox',
    label: 'Salesforce document is Internal Use Only',
    defaultValue: false,
  },
  'salesforce.document.isPublic': {
    type: 'checkbox',
    label: 'Salesforce document is Public',
    defaultValue: false,
  },
  'salesforce.attachment.id': {
    type: 'text',
    label: 'Salesforce attachment id',
  },
  'salesforce.attachment.name': {
    type: 'text',
    label: 'Salesforce attachment name',
  },
  'salesforce.attachment.parentId': {
    type: 'text',
    label: 'Salesforce attachment parent Id',
  },
  'salesforce.attachment.contentType': {
    type: 'text',
    label: 'Salesforce attachment content Type',
  },
  'salesforce.attachment.isPrivate': {
    type: 'checkbox',
    label: 'Salesforce attachment is Private',
    defaultValue: false,
  },
  'salesforce.attachment.description': {
    type: 'text',
    label: 'Salesforce attachment description',
  },
  'salesforce.contentVersion.id': {
    type: 'text',
    label: 'Salesforce content Version id',
  },
  'salesforce.contentVersion.title': {
    type: 'text',
    label: 'Salesforce content Version title',
  },
  'salesforce.contentVersion.pathOnClient': {
    type: 'text',
    label: 'Salesforce content Version path On Client',
  },
  'salesforce.contentVersion.tagCsv': {
    type: 'text',
    label: 'Salesforce content Version tag Csv',
  },
  'salesforce.contentVersion.contentLocation': {
    type: 'text',
    label: 'Salesforce content Version content Location',
  },
};
