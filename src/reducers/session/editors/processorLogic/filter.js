import { isString } from 'lodash';
import util from '../../../../utils/json';

export default {
  requestBody: editor => {
    let data;

    if (isString(editor.data)) {
      try {
        data = JSON.parse(editor.data);
      } catch (ex) {
        data = {};
      }
    } else {
      ({ data } = editor);
    }

    if (typeof data !== 'object') {
      data = {};
    }

    const { record, settings, ...context } = data;

    return {
      rules: { version: '1', rules: editor.rule || [] },
      data: typeof record === 'object' ? [record] : [{}],
      options: context,
    };
  },
  validate: editor => ({
    dataError:
      typeof editor.data !== 'object' && util.validateJsonString(editor.data),
  }),
};
