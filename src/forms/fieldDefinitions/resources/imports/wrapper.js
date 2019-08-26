export default {
  'wrapper.function': {
    type: 'text',
    label: 'Function',
    required: true,
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Configuration',
  },
  'wrapper.ifSoPleasePasteItHere': {
    type: 'textarea',
    label: 'If so,please paste it here',
  },
  'wrapper.parentOption': {
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
  'wrapper.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'wrapper.parentOption',
        is: ['true'],
      },
    ],
  },
  'wrapper.concurrencyIdLockTemplate': {
    type: 'textarea',
    label: 'Concurrency Id Lock Template',
  },
  'wrapper.dataUriTemplate': {
    type: 'text',
    label: 'Data URI Template',
    placeholder: 'Optional',
  },
};
