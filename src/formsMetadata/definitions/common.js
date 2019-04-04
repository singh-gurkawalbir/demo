export default {
  fields: [
    {
      id: 'CommonName',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
    },
    {
      id: 'CommonDescription',
      name: '/description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
  ],
};
