import util from '../../../../utils/json';
import javascript from './javascript';

export default {
  processor: 'javascript',
  skipPreview: ({ code, entryFunction }) => !code || !entryFunction,
  requestBody: javascript.requestBody,
  dirty: editor => {
    if (editor.data !== editor.initData) {
      return true;
    }

    return javascript.dirty(editor);
  },
  validate: ({ data }) => {
    let dataError;

    if (data === '') dataError = 'Must provide some sample data.';
    else if (typeof data === 'string')
      dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },
};
