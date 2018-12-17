import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: JSON.parse(editor.rule),
    data: [JSON.parse(editor.data)],
  }),
  validate: editor => ({
    ruleError: util.validateJsonString(editor.rule),
    dataError: util.validateJsonString(editor.data),
  }),
};
