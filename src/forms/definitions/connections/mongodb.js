export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'mongodb.hosts': { fieldId: 'mongodb.hosts' },
    'mongodb.database': { fieldId: 'mongodb.database' },
    'mongodb.username': { fieldId: 'mongodb.username' },
    'mongodb.password': { fieldId: 'mongodb.password' },
    'mongodb.replicaSet': { fieldId: 'mongodb.replicaSet' },
  },
  layout: {
    fields: [
      'name',
      'mongodb.hosts',
      'mongodb.database',
      'mongodb.username',
      'mongodb.password',
      'mongodb.replicaSet',
    ],
  },
};
