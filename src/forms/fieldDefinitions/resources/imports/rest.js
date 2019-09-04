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
  'rest.compositeMethod': {
    type: 'select',
    label: 'rest Method',
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
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
  },
  mapping: {
    type: 'dynarestmapping',
    label: 'Manage Import Mapping',
  },
  'rest.relativeUri': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
  },
  'rest.responseIdPath': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
  },
  'rest.compositeMethodUpdate': {
    type: 'select',
    label: 'rest Method',
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
        is: ['CREATE_AND_UPDATE'],
      },
    ],
  },
  'rest.relativeUriUpdate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE'],
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
        is: ['CREATE_AND_UPDATE'],
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
        is: ['CREATE_AND_UPDATE'],
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
        is: ['CREATE_AND_UPDATE'],
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
  'http.ifSoPleasePasteItHere': {
    type: 'textarea',
    label: 'If so,please paste it here',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'rest.advanceOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: 'N',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'Y' },
          { label: 'No', value: 'N' },
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
        field: 'rest.advanceOption',
        is: ['Y'],
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
  hookType: {
    type: 'radiogroup',
    label: 'Hook Type',
    defaultValue: 'script',
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.preMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.preMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.preMap._scriptId': {
    type: 'selectresource',
    placeholder: 'Please select a script',
    resourceType: 'scripts',
    label: 'Pre Map Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preMap._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Pre Map Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postMap._scriptId': {
    type: 'selectresource',
    placeholder: 'Please select a script',
    resourceType: 'scripts',
    label: 'Post Map Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postMap._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Map Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postSubmit._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postSubmit._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postSubmit._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Submit Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postSubmit._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Submit Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Aggregate Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Aggregate Stack Id',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
};
