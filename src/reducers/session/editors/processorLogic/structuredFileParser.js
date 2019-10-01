import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: JSON.parse(editor.rule),
    data: editor.data,
  }),
  validate: editor => ({
    ruleError: util.validateJsonString(editor.rule),
    dataError:
      (!editor.data || (editor.data && !editor.data.length)) &&
      'Must provide some sample data.',
  }),
};
