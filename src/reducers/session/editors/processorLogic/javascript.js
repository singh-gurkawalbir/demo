/* eslint-disable camelcase */
import util from '../../../../utils/json';

export default {
  requestBody: ({ data, code, entryFunction, context }) => ({
    rules: {
      function: entryFunction,
      code,
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
  dirty: editor => {
    const {
      _init_scriptId,
      scriptId,
      entryFunction,
      _init_entryFunction,
      _init_code,
      code,
    } = editor || {};

    if (entryFunction !== _init_entryFunction) {
      return true;
    }

    // in case script is used in javascript editor
    if ('scriptId' in editor) {
      // special case check where none is selected as scriptId by default and user types in code section and removes it.
      // TODO: Raghu to check why we have scriptId as undefined when none is selected by default and ''(empty quotes) when user selects none manually
      if (
        _init_scriptId === undefined &&
        (scriptId === '' || scriptId === undefined) &&
        (code === '' || code === undefined)
      ) {
        return false;
      }

      if (_init_scriptId !== scriptId) {
        return true;
      }
    }

    return _init_code !== code;
  },
};
