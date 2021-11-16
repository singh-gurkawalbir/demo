export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    defaultValue: r => r.displayName,
    required: true,
    helpKey: 'integration.name',
  },
};
