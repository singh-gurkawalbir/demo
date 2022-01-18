export default {
  name: {
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    isLoggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
};
