export default {
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  dirty: editor => editor.data !== editor._init_data
};
