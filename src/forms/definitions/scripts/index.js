export default {
  fields: [
    {
      id: 'name',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      id: 'description',
      name: '/description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    {
      id: 'content',
      name: '/content',
      type: 'scriptcontent',
      label: 'Script Content',
    },
  ],
};
