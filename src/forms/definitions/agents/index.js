export default {
  fieldMap: {
    name: {
      id: 'name',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      name: '/description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
  },
  layout: {
    fields: ['name', 'description'],
  },
};
