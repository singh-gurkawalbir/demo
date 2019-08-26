export default {
  'rest.method': {
    type: 'radiogroup',
    label: 'rest request Media Type',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'Composite', value: 'COMPOSITE' },
        ],
      },
    ],
  },
  'rest.headers': {
    type: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'rest.compositeType': {
    type: 'select',
    label: 'Composite Type',
    options: [
      {
        items: [
          {
            label: 'Create New Data & Update Existing Data',
            value: 'CREATE_AND_UPDATE',
          },
          {
            label: 'Create New Data & Ignore Existing Data',
            value: 'CREATE_AND_IGNORE',
          },
          {
            label: 'Update Existing Data & Ignore NEW Data',
            value: 'UPDATE_AND_IGNORE',
          },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rest.relativeUri': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'rest.responseIdPath': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'rest.createNewData': {
    type: 'labeltitle',
    label: 'Create New Data',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.compositeMethodCreate': {
    type: 'select',
    label: 'HTTP Method',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.relativeUriCreate': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.successPathCreate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.successValuesCreate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.responseIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'rest.upateExistingData': {
    type: 'labeltitle',
    label: 'Upate Existing Data',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.compositeMethodUpdate': {
    type: 'select',
    label: 'HTTP Method',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.relativeUriUpdate': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.successPathUpdate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.successValuesUpdate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.responseIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.ignoreExistingData': {
    type: 'labeltitle',
    label: 'Ignore Existing Data',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_IGNORE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_IGNORE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'rest.ifSoPleasePasteItHere': {
    type: 'textarea',
    label: 'If so,please paste it here',
  },
  'rest.parentOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: 'false',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  'rest.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'rest.parentOption',
        is: ['true'],
      },
    ],
  },
  'rest.concurrencyIdLockTemplate': {
    type: 'textarea',
    label: 'Concurrency Id Lock Template',
  },
  'rest.dataUriTemplate': {
    type: 'text',
    label: 'Data URI Template',
    placeholder: 'Optional',
  },
};
