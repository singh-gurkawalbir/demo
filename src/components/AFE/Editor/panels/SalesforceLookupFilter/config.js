export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    // 'not-group': null,
  },
  allow_empty: true,
  operators: [
    {
      type: 'equalto',
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
      type: 'less',
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
      type: 'less_or_equal',
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
  ],
  lang: {
    operators: {
      equalto: '=',
      not_equal: '!=',
      less: '<',
      less_or_equal: '<=',
      greater: '>',
      greater_or_equal: '>=',
    },
    add_rule: 'Add filter',
    add_group: 'Add group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false,
};

