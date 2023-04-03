export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    'not-group': null,
  },
  allow_empty: true,
  operators: [
    {
      type: 'equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'not_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'greater',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'greater_or_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'less',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'less_or_equal',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'begins_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'ends_with',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'not_contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'is_empty',
    },
    {
      type: 'is_not_empty',
    },
    {
      type: 'matches',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
  ],
  lang: {
    operators: {
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
      equal: 'equals',
      not_equal: 'not equals',

      greater: 'is greater than',
      greater_or_equal: 'is greater than or equals',
      less: 'is less than',
      less_or_equal: 'is less than or equals',

      begins_with: 'starts with',
      ends_with: 'ends with',
      contains: 'contains',
      not_contains: 'does not contain',

      matches: 'matches',
    },
    add_rule: 'Add rule',
    add_group: 'Add group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false, // self.readOnly,
};

