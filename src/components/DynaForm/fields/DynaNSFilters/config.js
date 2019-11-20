export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    'not-group': null,
  },
  allow_empty: true,
  operators: [
    {
      type: 'is',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'equalto',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'on',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'anyof',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'isempty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'isnotempty',
      nb_inputs: 0,
      multiple: false,
      apply_to: ['boolean', 'number', 'string'],
    },
    {
      type: 'startswith',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
    {
      type: 'contains',
      nb_inputs: 1,
      multiple: false,
      apply_to: ['string'],
    },
  ],
  lang: {
    operators: {
      equalto: 'equal to',
      isempty: 'empty',
      isnotempty: 'not empty',
      contains: 'contains',
      startswith: 'starts with',
    },
    add_rule: 'Add Filter',
    add_group: 'Add Group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false, // self.readOnly,
};
