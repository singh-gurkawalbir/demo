export default {
  name: {
    type: 'text',
    label: 'Name',
    defaultValue: r => r.displayName,
    required: true,
    helpKey: 'integration.name',
  },
};
