import util from '../../../../utils/json';

export default {
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.rule },
    data: JSON.parse(editor.data),
  }),
  validate: ({data}) => ({
    dataError: !data
      ? 'Must provide some sample data.'
      : typeof data === 'string' && util.validateJsonString(data),
  }),
  processResult: ({resultMode}, result) => {
    const {data, ...rest} = result;

    if (data) {
      if (resultMode === 'json') {
        try {
          JSON.parse(data);
        } catch (e) {
          return {data, warning: `Evaluated result is not valid JSON. ${e.message || ''}`, ...rest};
        }
      } else if (resultMode === 'xml') {
        const xmldoc = new DOMParser().parseFromString(data, 'text/xml');
        const parseError = xmldoc.getElementsByTagName('parsererror');

        if (parseError?.length) {
          const errorText = parseError[0].childNodes?.[1]?.textContent || '';

          return {data, warning: `Evaluated result is not valid XML. ${errorText}`, ...rest};
        }
      }
    }

    return result;
  },
};
