import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { version: '1', rules: [editor.rule || []] },
    data: [JSON.parse(editor.data)],
  }),
  validate: editor => ({
    dataError: util.validateJsonString(editor.data),
  }),
};
