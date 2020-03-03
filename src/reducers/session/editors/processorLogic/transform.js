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
    let dataError;

    if (editor.data === undefined || editor.data === '')
      dataError = 'Must provide some sample data.';
    else if (typeof editor.data !== 'object')
      dataError = util.validateJsonString(editor.data);
    const isContainsAllKey = util.containsAllKeys(editor.rule, [
      'generate',
      'extract',
    ]);

    return {
      dataError,
      ruleError: isContainsAllKey !== null && isContainsAllKey,
    };
  },
  dirty: editor => {
    const { initRule = [], rule = [] } = editor || {};
    const rulesDiff = differenceWith(initRule, rule, isEqual);
    const isRulesEqual = initRule.length === rule.length && !rulesDiff.length;

    return !isRulesEqual;
  },
};
