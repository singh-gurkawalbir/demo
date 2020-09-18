import util from '../../../../utils/json';
import { safeParse } from '../../../../utils/string';

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
  processResult: ({mode}, result) => {
    const {data, ...rest} = result;

    if (data) {
      if (mode === 'json') {
        const parsedData = safeParse(data);

        if (!parsedData) {
          return {data, warning: 'Evaluated result is not valid JSON.', ...rest};
        }
      } else if (mode === 'xml') {
        const xmldoc = new DOMParser().parseFromString(data, 'text/xml');
        const parseError = xmldoc.getElementsByTagName('parsererror');

        if (parseError?.length) {
          return {data, warning: 'Evaluated result is not valid XML.', ...rest};
        }
      }
    }

    return result;
  },
};
