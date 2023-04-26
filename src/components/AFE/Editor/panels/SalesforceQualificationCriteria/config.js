export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    'not-group': null,
    'sql-support': { boolean_as_integer: false },
  },
  allow_empty: true,
  display_empty_filter: false,
  sqlOperators: {
    begins_with: { op: 'LIKE ?', mod: '{0}%' },
    contains: { op: 'LIKE ?', mod: '%{0}%' },
    ends_with: { op: 'LIKE ?', mod: '%{0}' },
    is_null: { op: '= null' },
    is_not_null: { op: '!= null' },
  },
  lang: {
    operators: {
      equal: 'equals',
      not_equal: 'not equals',

      greater: 'is greater than',
      greater_or_equal: 'is greater than or equals',
      less: 'is less than',
      less_or_equal: 'is less than or equals',

      begins_with: 'starts with',
    },
    add_rule: 'Add filter',
    add_group: 'Add group',
    delete_rule: ' ',
    delete_group: ' ',
  },
};
