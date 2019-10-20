export default {
  'netsuite_da.recordType': {
    label: 'Record Type',
    required: true,
    mode: 'suitescript',
    type: 'refreshableselect',
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
  },
  'netsuite_da.operation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
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
    ],
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
  },
  'netsuite_da.hooks.preMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Pre Map File',
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
  },
  'netsuite_da.hooks.postMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Map File',
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
  },
  'netsuite_da.hooks.postSubmit.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Submit File',
  },
};
