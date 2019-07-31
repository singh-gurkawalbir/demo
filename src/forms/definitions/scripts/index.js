export default {
  fields: [
    {
      fieldId: 'name',
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
