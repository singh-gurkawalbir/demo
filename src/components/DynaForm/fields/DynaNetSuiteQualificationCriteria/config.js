export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    // 'not-group': null,
  },
  allow_empty: true,
  operators: [
    {
      type: 'is_empty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'is_not_empty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
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
      type: 'contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    {
      type: 'greater',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number'],
    },
    {
      type: 'less',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['number'],
    },
  ],
  lang: {
    operators: {
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
      equal: 'is',
      not_equal: 'is not',
      contains: 'like',
      greater: 'greater than',
      less: 'less than',
    },
    add_rule: 'Add Filter',
    add_group: 'Add Group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false,
};
