import util from '../../../../utils/json';

const { merge } = require('lodash');

export default {
  requestBody: editor => {
    const getRequestBody = () => {
      if (editor.editorId === 'SQLQueryBuilderEditor') {
        return merge(
          {},
          editor.defaultData ? JSON.parse(editor.defaultData) : {},
          editor.sampleData ? JSON.parse(editor.sampleData) : {}
        );
      }

      return JSON.parse(editor.data);
    };

    return {
      rules: { strict: !!editor.strict, template: editor.template },
      data: getRequestBody(),
    };
  },
  validate: editor => {
    const getDataError = () => {
      if (editor.editorId === 'SQLQueryBuilderEditor') {
        let toReturn = null;

        if (editor.sampleData) {
          toReturn = util.validateJsonString(editor.sampleData);
        }

        if (!toReturn && editor.defaultData) {
          toReturn = util.validateJsonString(editor.defaultData);
        }

        return toReturn;
      }

      return util.validateJsonString(editor.data);
    };

    return {
      dataError: getDataError(),
    };
  },
};
