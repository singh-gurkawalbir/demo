export default {
  fieldMap: {
    branchType: {
      id: 'branchType',
      name: 'branchType',
      helpText: 'We need help text!',
      type: 'radiogroup',
      label: 'Branching type',
      description: 'Records will flow through',
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
    branches: {
      id: 'branches',
      label: 'Branches',
      type: 'labeltitle',
      helpText: 'We need help text!',
    },
  },
};
