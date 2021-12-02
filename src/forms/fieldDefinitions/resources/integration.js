export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    loggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
};
