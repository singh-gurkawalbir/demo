import util from '../../../../utils/json';

export default {
  requestBody: ({ data, code, entryFunction, context }) => ({
    rules: {
      function: entryFunction,
      code,
    },
    options: context,
    data: typeof data === 'string' ? JSON.parse(data) : data,
  }),
  validate: ({ data }) => {
    let dataError;

    if (data === '') dataError = 'Must provide some sample data.';
    else if (typeof data === 'string')
      dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },
  dirty: editor => {
    const { entryFunction, initEntryFunction, initCode, code } = editor || {};

    return entryFunction !== initEntryFunction || initCode !== code;
  },
};
