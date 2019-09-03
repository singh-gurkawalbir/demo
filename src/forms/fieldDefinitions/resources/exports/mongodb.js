export default {
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    type: 'editor',
    mode: 'json',
    label: 'Filter',
  },
  'mongodb.projection': {
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
};
