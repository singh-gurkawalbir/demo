import util from '../../../../utils/json';

const { merge } = require('lodash');

export default {
  processor: 'handlebars',
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.template },
    data: merge(
      {},
      editor.defaultData ? JSON.parse(editor.defaultData) : {},
      editor.sampleData ? JSON.parse(editor.sampleData) : {}
    ),
  }),
  validate: editor => {
    const getDataError = () => {
      const errMessages = [];

      if (editor.sampleData) {
        const message = util.validateJsonString(editor.sampleData);

        if (message) errMessages.push(`Sample Data : ${message}`);
      }

      if (editor.defaultData) {
        const message = util.validateJsonString(editor.defaultData);

        if (message) errMessages.push(`Default Data : ${message}`);
      }

      return errMessages.join('\n');
    };

    return {
      dataError: getDataError(),
    };
  },
};
