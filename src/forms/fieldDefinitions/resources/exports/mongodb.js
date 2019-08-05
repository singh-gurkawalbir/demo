export default {
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
  },
  'mongodb.filter': {
    type: 'textarea',
    label: 'Filter',
  },
  'mongodb.projection': {
    type: 'textarea',
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
  exportData: {
    type: 'labeltitle',
    label: 'What would you like to export from MongoDB?',
  },
  'delta.dateField': {
    type: 'text',
    label: 'Date Field',
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
};
