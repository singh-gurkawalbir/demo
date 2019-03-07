export default {
  fields: [
    {
      id: 'Name',
      name: '/name',
      type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
  ],
};
