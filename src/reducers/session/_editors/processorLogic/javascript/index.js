/* eslint-disable camelcase */
import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';

export default {
  init: ({options}) => ({
    ...options,
    insertStubKey: options.stage, // todo ashu test this
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
    const {fetchScriptContent: originalFetchScriptContent, ...originalRest} = originalRule || {};

    if (_init_code !== code) { return true; }

    if (!isEqual(originalRest, rest)) {
      return true;
    }

    return false;
  },
  processResult: (editor, result) => ({data: result ? result.data : ''}),
};
