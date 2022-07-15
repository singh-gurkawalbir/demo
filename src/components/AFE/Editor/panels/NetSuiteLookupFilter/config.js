import { langOperators, operatorConfig } from './operators';

export default {
  plugins: {
    // 'bt-tooltip-errors': { delay: 100 },
    'not-group': null,
  },
  allow_empty: true,
  operators: operatorConfig,
  lang: {
    operators: langOperators,
    add_rule: 'Add Filter',
    add_group: 'Add Group',
    delete_rule: ' ',
    delete_group: ' ',
  },
  display_empty_filter: false,
};
