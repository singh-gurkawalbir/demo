import util from '../../../../utils/json';

export default {
  requestBody: ({ data, code, entryFunction }) => ({
    rules: {
      function: entryFunction,
      code,
    },
    data: typeof data === 'string' ? JSON.parse(data) : data,
  }),
  validate: ({ data }) =>
    // ruleError: undefined //  no validation yet.
    // if data is a string we should validate if it is serializable
    ({
      dataError:
        typeof data === 'string' ? util.validateJsonString(data) : null,
    }),
};
