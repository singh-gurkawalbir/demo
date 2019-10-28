import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { version: '1', rules: [editor.rule || []] },
    // transform editor expects an array of records
    data:
      typeof editor.data === 'object'
        ? [editor.data]
        : [JSON.parse(editor.data)],
  }),
  // No point performing parsing or validation when it is an object
  validate: editor => ({
    dataError:
      typeof editor.data !== 'object' && util.validateJsonString(editor.data),
    ruleError: util.containsAllKeys(editor.rule, ['generate', 'extract']),
  }),
};
