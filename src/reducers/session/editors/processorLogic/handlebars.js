import util from '../../../../utils/json';

const _ = require('lodash');

export default {
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.template },
    data:
      editor.editorId !== 'SQLQueryBuilderEditor'
        ? JSON.parse(editor.data)
        : _.merge(
            {},
            JSON.parse(editor.defaultData || {}),
            JSON.parse(editor.sampleData || {})
          ),
  }),
  validate: editor => ({
    dataError:
      editor.editorId !== 'SQLQueryBuilderEditor'
        ? util.validateJsonString(editor.data)
        : util.validateJsonString(editor.sampleData) ||
          util.validateJsonString(editor.defaultData),
  }),
};
