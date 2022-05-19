export default {
  fieldMap: {
    branchType: {
      id: 'branchType',
      name: 'branchType',
      type: 'radiogroup',
      label: 'Records will flow through:',
      // description: '',
      // showOptionsHorizontally: true,
      // fullWidth: true,
      options: [
        {
          items: [
            { value: 'first', label: 'First matching branch' },
            { value: 'all', label: 'All matching branches' },
          ],
        },
      ],
      defaultValue: 'first',
    },
  },
};
