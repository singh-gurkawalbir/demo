/* eslint-disable camelcase */
import { differenceWith, isEqual } from 'lodash';
import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { version: '1', rules: [editor.rule || []] },
    // transform editor expects an array of records
    data:
      typeof editor.data === 'object'
        ? [editor.data]
        : [JSON.parse(editor.data)],
  }),
  // No point performing parsing or validation when it is an object
  validate: editor => {
    const { data, rule } = editor;
    let dataError;

    if (!data) dataError = 'Must provide some sample data.';
    else if (typeof data !== 'object') dataError = util.validateJsonString(data);
    const isContainsAllKey = util.containsAllKeys(rule, [
      'generate',
      'extract',
    ]);

    return {
      dataError,
      ruleError: isContainsAllKey !== null && isContainsAllKey,
    };
  },
  dirty: editor => {
    // TODO: @ashu fix this
    const {
      _init_rule = [],
      data,
      _init_data,
      rule = [],
      optionalSaveParams = {},
    } = editor || {};
    const { processorKey } = optionalSaveParams;

    // in case of response transformation, data change is considered as editor change
    if (processorKey === 'responseTransform' && _init_data !== data) {
      return true;
    }

    const rulesDiff = differenceWith(_init_rule, rule, isEqual);
    const isRulesEqual = _init_rule.length === rule.length && !rulesDiff.length;

    return !isRulesEqual;
  },
};
