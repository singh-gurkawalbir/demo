export default {
  'mongodb.collection': {
    loggable: true,
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    loggable: true,
    type: 'sqlquerybuilder',
    label: 'MongoDB filter',
  },
  'mongodb.projection': {
    loggable: true,
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
};
