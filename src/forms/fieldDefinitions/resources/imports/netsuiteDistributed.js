export default {
  'netsuite_da.recordType': {
    label: 'Record Type',
    required: true,
    mode: 'suitescript',
    type: 'refreshableselect',
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.operation': {
    type: 'radiogroup',
    label: 'Operation',
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
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or Update', value: 'addupdate' },
        ],
      },
    ],
  },
  'netsuite_da.blob.operation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or Update', value: 'addupdate' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'netsuite_da.internalIdLookup.expression': {
    type: 'text',
    label: 'How can we find existing records?',
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'netsuite_da.operation',
        is: ['update', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Pre Map File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Map File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite.file.name': {
    type: 'text',
    label: 'Name',
    visibleWhenAll: [
      {
        field: 'netsuite_da.blob.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.fileType': {
    type: 'text',
    label: 'File Type',
    visibleWhenAll: [
      {
        field: 'netsuite_da.blob.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.folder': {
    type: 'text',
    label: 'Folder',
    visibleWhenAll: [
      {
        field: 'netsuite_da.blob.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.internalId': {
    type: 'text',
    label: 'File Internal Id',
    visibleWhenAll: [
      {
        field: 'netsuite_da.blob.operation',
        is: ['update', 'delete'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Submit File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
