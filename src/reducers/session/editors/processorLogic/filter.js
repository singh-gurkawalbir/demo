import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { version: '1', rules: editor.rule || [] },
    // transform editor expects an array of records
    data: typeof editor.data === 'object' ? [editor.data] : [{}],
  }),
  validate: editor => ({}),
};
