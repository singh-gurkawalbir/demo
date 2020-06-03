export default {
  'netsuite_da.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    bundlePath: r => r && `connections/${r._connectionId}/distributed`,
    bundleUrlHelp:
      'Important!  Please install our <a target="_blank" href="BUNDLE_URL">integrator.io bundle</a> in your NetSuite account to enable Real-time export capabilities or to use the recommended RESTlet based search engine.',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.mapping': {
    type: 'text',
    visible: false,
  },
  'netsuite_da.subrecords': {
    required: false,
    type: 'netsuitesubrecords',
    connectionId: r => r && r._connectionId,
  },
  'netsuite_da.operation': {
    type: 'radiogroupforresetfields',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
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
          { label: 'Add or update', value: 'addupdate' },
        ],
      },
    ],
  },
  'netsuite.operation': {
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
          { label: 'Add or update', value: 'addupdate' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'netsuite_da.internalIdLookup.expression': {
    type: 'netsuitelookup',
    label: 'How can we find existing records?',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'netsuite_da.operation',
        is: ['update', 'addupdate'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'Pre map',
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
    label: 'Pre map file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'Post map',
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
    label: 'Post map file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'Post submit',
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
        field: 'netsuite.operation',
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
    label: 'File type',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
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
        field: 'netsuite.operation',
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
    label: 'File internal ID',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
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
    label: 'Post submit file',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
