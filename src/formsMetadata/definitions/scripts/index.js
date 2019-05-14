export default {
  fields: [
    {
      id: 'name',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      name: 'description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    {
      id: 'content',
      name: '/ignore/me',
      defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
      type: 'hook',
      label: 'Edit Script',
    },
  ],
};
