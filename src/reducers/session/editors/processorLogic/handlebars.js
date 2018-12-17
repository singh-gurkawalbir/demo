import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.template },
    data: JSON.parse(editor.data),
  }),
  validate: editor => ({
    dataError: util.validateJsonString(editor.data),
  }),
};
