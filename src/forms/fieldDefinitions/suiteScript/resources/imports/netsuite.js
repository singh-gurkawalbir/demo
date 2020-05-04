export default {
  'import.netsuite.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r.ssLinkedConnectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r.ssLinkedConnectionId,
  },
  'import.netsuite.operation': {
    type: 'radiogroupforresetfields',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
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
  'import.netsuite.internalIdLookup.expression': {
    type: 'netsuitelookup',
    label: 'How can we find existing records?',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'import.netsuite.operation',
        is: ['update', 'addupdate'],
      },
    ],
  },
};
