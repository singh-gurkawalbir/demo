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
      { id: 'import.netsuite.ignoreExisting', type: 'checkbox' },
      { id: 'import.netsuite.ignoreMissing', type: 'checkbox' },
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
  'import.netsuite.ignoreExisting': {
    type: 'checkbox',
    label: 'Ignore existing records',
    defaultValue: r => !!(r?.import?.netsuite?.ignoreExisting),
    visibleWhen: [
      {
        field: 'import.netsuite.operation',
        is: ['add']
      }
    ]
  },
  'import.netsuite.ignoreMissing': {
    type: 'checkbox',
    label: 'Ignore missing records',
    defaultValue: r => !!(r?.import?.netsuite?.ignoreMissing),
    visibleWhen: [
      {
        field: 'import.netsuite.operation',
        is: ['update']
      }
    ]
  },
  'import.netsuite.internalIdLookup.expression': {
    type: 'suitescriptnetsuitelookup',
    label: 'How can we find existing records?',
    required: true,
    visibleWhen: [
      {
        field: 'import.netsuite.ignoreExisting',
        is: [true],
      },
      {
        field: 'import.netsuite.operation',
        is: ['update', 'addupdate'],
      },
    ],
    ssLinkedConnectionId: r => r?.ssLinkedConnectionId,
    integrationId: r => r?._integrationId,
  },
};
