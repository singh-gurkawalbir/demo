import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';

export default {
  init: ({options, fieldState, fileDefinitionData, resource}) => {
    const {sampleData, rule} = fileDefinitionData || {};
    const data = options.stage ? '' : JSON.stringify(resource?.sampleData, null, 2) || sampleData;

    return {
      ...options,
      rule: fieldState?.value || rule,
      data,
      originalData: data,
    };
  },
  dirty: editor => {
    if (!isEqual(editor.data, editor.originalData) || !isEqual(editor.rule, editor.originalRule)) {
      return true;
    }

    return false;
  },
  requestBody: editor => ({
    rules: JSON.parse(editor.rule),
    data: JSON.parse(editor.data),
  }),
  validate: editor => ({
    ruleError: util.validateJsonString(editor.rule),
    dataError: util.validateJsonString(editor.data),
  }),
};
