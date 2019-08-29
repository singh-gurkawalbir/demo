export default {
  'netsuite.restlet.recordType': {
    label: 'Record Type',
    mode: 'suitescript',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.restlet && r.netsuite.restlet.recordType,
    required: true,
    type: 'refreshableselect',
    resourceType: 'recordTypes',
    connectionId: r => r && r._connectionId,
  },
  'netsuite.operation': {
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
  'netsuite.ignoreExistingRecords': {
    type: 'checkbox',
    label: 'Ignore Existing Records',
    visibleWhen: [
      {
        field: 'netsuite.operation',
        is: ['add'],
      },
    ],
  },
  'netsuite.ignoreMissingRecords': {
    type: 'checkbox',
    label: 'Ignore Missing Records',
    visibleWhen: [
      {
        field: 'netsuite.operation',
        is: ['update'],
      },
    ],
  },
  'netsuite.suitescriptPremapFunction': {
    type: 'text',
    label: 'Pre Map ',
    placeholder: 'Function Name',
  },
  'netsuite.suitescriptPremapFileInternalID': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Pre Map File',
  },
  'netsuite.suitescriptPostmapFunction': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
  },
  'netsuite.suitescriptPostmapFileInternalID': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Map File',
  },
  'netsuite.suitescriptPostSubmitFunction': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
  },
  'netsuite.suitescriptPostSubmitFileInternalID': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Submit File',
  },
};
