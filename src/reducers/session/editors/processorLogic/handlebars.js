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
  processResult: ({mode}, result) => {
    const {data, ...rest} = result;

    if (data) {
      if (mode === 'json') {
        try {
          JSON.parse(data);
        } catch (e) {
          return {data, warning: `Evaluated result is not valid JSON. ${e.message || ''}`, ...rest};
        }
      } else if (mode === 'xml') {
        const xmldoc = new DOMParser().parseFromString(data, 'text/xml');
        const parseError = xmldoc.getElementsByTagName('parsererror');

        if (parseError?.length) {
          return {data, warning: `Evaluated result is not valid XML. ${parseError[0].childNodes?.[1]?.textContent || ''}`, ...rest};
        }
      }
    }

    return result;
  },
};
