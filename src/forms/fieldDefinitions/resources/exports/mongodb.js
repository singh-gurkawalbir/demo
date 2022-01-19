export default {
  'mongodb.collection': {
    isLoggable: true,
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    isLoggable: true,
    type: 'sqlquerybuilder',
    label: 'MongoDB filter',
  },
  'mongodb.projection': {
    isLoggable: true,
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
};
