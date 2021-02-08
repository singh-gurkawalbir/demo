/* eslint-disable camelcase */
import { differenceWith, isEqual } from 'lodash';
import util from '../../../../../utils/json';
import arrayUtil from '../../../../../utils/array';

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
    const {
      originalRule = [],
      rule = [],
    } = editor;

    // todo: check if this is really required in case of response transformation, data change is considered as editor change
    // if (processorKey === 'responseTransform' && _init_data !== data) {
    //   return true;
    // }

    const rulesDiff = differenceWith(originalRule, rule, isEqual);
    const isRulesEqual = originalRule.length === rule.length && !rulesDiff.length;

    return !isRulesEqual;
  },
  processResult: (editor, result) => ({data: result?.data?.[0]}),
  preSaveValidate: editor => {
    const duplicates = arrayUtil.getDuplicateValues(editor.rule, 'generate');

    if (duplicates?.length) {
      return {saveError: true, message: `You have duplicate mappings for the field(s): ${duplicates.join(',')}`};
    }

    return {saveError: false};
  },
};
