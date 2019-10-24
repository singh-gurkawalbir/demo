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
};
