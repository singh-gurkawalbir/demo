export default {
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    type: 'sqlquerybuilder',
    label: 'MongoDB filters',
  },
  'mongodb.projection': {
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
};
