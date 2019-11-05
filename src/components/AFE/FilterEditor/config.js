export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    'not-group': null,
  },
  allow_empty: true,
  lang: {
    operators: {
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
      equal: 'equals',
      not_equal: 'not equals',

      greater: 'is greater-than',
      greater_or_equal: 'is greater-than or equals',
      less: 'is less-than',
      less_or_equal: 'is less-than or equals',

      begins_with: 'starts with',
      ends_with: 'ends with',
      contains: 'contains',
      not_contains: 'does not contains',

      matches: 'matches',
    },
    add_rule: 'Add Rule',
    add_group: 'Add Group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false, // self.readOnly,
};
