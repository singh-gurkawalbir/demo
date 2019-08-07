import util from '../../../../utils/json';

const { merge } = require('lodash');

export default {
  processor: 'handlebars',
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.template },
    data: merge(
      {},
      editor.defaultData ? JSON.parse(editor.defaultData) : {},
      editor.sampleData ? JSON.parse(editor.sampleData) : {}
    ),
  }),
  validate: editor => {
    const getDataError = () => {
      let errMsg = null;

      if (editor.sampleData) {
        errMsg = util.validateJsonString(editor.sampleData);
      }

      if (!errMsg && editor.defaultData) {
        errMsg = util.validateJsonString(editor.defaultData);
      }

      return errMsg;
    };

    return {
      dataError: getDataError(),
    };
  },
};
