/* eslint-disable camelcase */
import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';

export default {
  init: ({options, scriptContext}) => ({
    ...options,
    insertStubKey: options.stage,
    context: scriptContext,
    rule: {
      scriptId: options.rule?._scriptId,
      entryFunction: options.rule?.function || hooksToFunctionNamesMap[options.stage],
      fetchScriptContent: true,
    },
  }),

  requestBody: ({ data, rule, context }) => ({
    rules: {
      function: rule.entryFunction,
      code: rule.code,
    },
    options: context,
    data: typeof data === 'string' ? JSON.parse(data) : data,
  }),
  validate: ({ data }) => {
    let dataError;

    if (!data) dataError = 'Must provide some sample data.';
    else if (typeof data === 'string') dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },
  dirty: ({originalRule, rule}) => {
    const {
      _init_code = '',
      code = '',
      fetchScriptContent,
      ...rest
    } = rule || {};
    const {fetchScriptContent: originalFetchScriptContent,
      _init_code: originalInitCode,
      code: originalCode,
      ...originalRest} = originalRule || {};

    if (_init_code !== code) { return true; }

    if (!isEqual(originalRest, rest)) {
      return true;
    }

    return false;
  },
  processResult: (editor, result) => ({data: result?.data || '', logs: result?.logs}),
  patchSet: editor => {
    const { code, scriptId } = editor.rule || {};

    const patches = {
      foregroundPatches: [{
        patch: [
          {
            op: 'replace',
            path: '/content',
            value: code,
          },
        ],
        resourceType: 'scripts',
        resourceId: scriptId,
      }],
    };

    return patches;
  },
};
