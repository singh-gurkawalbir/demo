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
      originalRule = [],
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

    const rulesDiff = differenceWith(originalRule, rule, isEqual);
    const isRulesEqual = originalRule.length === rule.length && !rulesDiff.length;

    return !isRulesEqual;
  },
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };
    const {
      editorType,
      rule,
      scriptId,
      code,
      entryFunction,
      optionalSaveParams = {},
    } = editor;
    const { resourceId, resourceType } = optionalSaveParams;
    const type = editorType === 'transform' ? 'expression' : 'script';
    const path = '/transform';
    const value = {
      type,
      expression: {
        version: 1,
        rules: rule ? [rule] : [[]],
      },
      script: {
        _scriptId: scriptId,
        function: entryFunction,
      },
    };

    patches.foregroundPatches = {
      patch: [{ op: 'replace', path, value }],
      resourceType,
      resourceId,
    };

    if (type === 'script') {
      patches.backgroundPatches.push({
        patch: [
          {
            op: 'replace',
            path: '/content',
            value: code,
          },
        ],
        resourceType: 'scripts',
        resourceId: scriptId,
      });
    }

    return patches;
  },
};
