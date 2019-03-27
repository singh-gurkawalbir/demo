export default {
  fields: [
    {
      id: 'CommonName',
      name: '/name',
      defaultValue: '{{name}}',
      type: 'text',
      label: 'Name',
    },
    {
      id: 'CommonDescription',
      name: '/description',
      defaultValue: '{{description}}',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
  ],
};
