export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    // 'not-group': null,
  },
  allow_empty: true,
  operators: [
    {
      type: 'equal',
      nb_inputs: 1,
      multiple: false,
    },
    {
      type: 'not_equal',
      nb_inputs: 1,
      multiple: false,
    },
    {
      type: 'like',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    {
      type: 'less',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    {
      type: 'greater',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },

    {
      type: 'is_empty',
      nb_inputs: 0,
      multiple: false,
    },
    {
      type: 'is_not_empty',
      nb_inputs: 0,
      multiple: false,
    },
    {
      type: 'contains',
      nb_inputs: 1,
      multiple: false,
    },
    {
      type: 'not_contains',
      nb_inputs: 1,
      multiple: false,
    },
  ],
  lang: {
    operators: {
      equal: 'is',
      not_equal: 'is not',
      like: 'like',
      less: 'less than',
      greater: 'greater than',
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
      contains: 'contains',
      not_contains: 'does not contain',
    },
    add_rule: 'Add filter',
    add_group: 'Add group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false,
};
