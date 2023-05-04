export default {
  fieldMap: {
    name: { fieldId: 'name', type: 'textwithplaceholder', isApplicationPlaceholder: true, isLabelUpdate: true },
    description: { fieldId: 'description' },
    _connectionId: {
      fieldId: '_connectionId',
    },
  },
  layout: { fields: ['name', 'description', '_connectionId'] },
};
