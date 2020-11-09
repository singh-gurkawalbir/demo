export default {
  'mongodb.collection': {
    type: 'text',
    label: 'Collection',
    required: true,
  },
  'mongodb.filter': {
    type: 'sqlquerybuilder',
    hideDefaultData: true,
    label: 'Build MongoDB filter',
  },
  'mongodb.projection': {
    type: 'editor',
    mode: 'json',
    label: 'Projection',
  },
};
