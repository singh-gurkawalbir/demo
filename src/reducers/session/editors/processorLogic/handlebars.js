import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.template },
    data: JSON.parse(editor.data),
  }),
  validate: editor => ({
    dataError: !editor.data
      ? 'Must provide some sample data.'
      : util.validateJsonString(editor.data),
  }),
  dirty: editor => {
    const { template, initTemplate } = editor || {};

    return template !== initTemplate;
  },
};
