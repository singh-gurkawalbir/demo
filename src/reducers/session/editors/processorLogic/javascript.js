import util from '../../../../utils/json';

export default {
  requestBody: ({ data, code, entryFunction }) => ({
    rules: {
      function: entryFunction,
      code,
    },
    data: typeof data === 'string' ? JSON.parse(data) : data,
  }),
  validate: ({ data }) => ({
    // ruleError: undefined //  no validation yet.
    dataError: util.validateJsonString(data),
  }),
};
