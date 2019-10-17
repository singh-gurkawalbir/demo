export default {
  name: {
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  content: {
    defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
    type: 'hook',
    hookType: 'script',
    label: 'Edit Script',
  },
};
