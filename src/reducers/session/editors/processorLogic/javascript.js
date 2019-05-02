import util from '../../../../utils/json';

export default {
  requestBody: ({ data, code, entryFunction }) => ({
    rules: {
      function: entryFunction,
      code,
    },
    data: JSON.parse(data),
  }),
  validate: ({ data }) => ({
    // ruleError: undefined //  no validation yet.
    dataError: util.validateJsonString(data),
  }),
};
