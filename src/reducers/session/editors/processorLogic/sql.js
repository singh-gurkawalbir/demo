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
      let toReturn = null;

      if (editor.sampleData) {
        toReturn = util.validateJsonString(editor.sampleData);
      }

      if (!toReturn && editor.defaultData) {
        toReturn = util.validateJsonString(editor.defaultData);
      }

      return toReturn;
    };

    return {
      dataError: getDataError(),
    };
  },
};
