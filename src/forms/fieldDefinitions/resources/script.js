export default {
  name: {
    name: '/name',
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
    name: '/content',
    type: 'scriptcontent',
    label: 'Script Content',
  },
};
