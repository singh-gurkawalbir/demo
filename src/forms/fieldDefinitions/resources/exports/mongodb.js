export default {
  'mongodb.method': {
    type: 'radiogroup',
    label: 'Mongodb method',
    options: [{ items: [{ label: 'Find', value: 'find' }] }],
  },
  'mongodb.collection': {
    type: 'text',
    label: 'Mongodb collection',
  },
  'mongodb.filter': {
    type: 'text',
    label: 'Mongodb filter',
  },
  'mongodb.projection': {
    type: 'text',
    label: 'Mongodb projection',
  },
};
