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
      options: { settings, contextData: context },
    };
  },
  validate: editor => ({
    dataError:
      typeof editor.data !== 'object' && util.validateJsonString(editor.data),
    ruleError: editor.isInvalid ? 'Invalid rule' : undefined,
  }),
  processResult: (editor, {data}) => {
    let outputMessage = '';

    if (data) {
      if (data.length > 0) {
        outputMessage = 'TRUE: record will be processed';
      } else {
        outputMessage = 'FALSE: record will be ignored/discarded';
      }
    }

    return {data: outputMessage};
  },
};
