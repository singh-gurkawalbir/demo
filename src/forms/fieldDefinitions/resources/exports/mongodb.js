export default {
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    type: 'sqlquerybuilder',
    label: 'MongoDB filter',
  },
  'mongodb.projection': {
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
};
