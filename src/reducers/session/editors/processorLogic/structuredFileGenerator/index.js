import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';

export default {
  init: ({options, fieldState, fileDefinitionData}) => {
    const {sampleData, rule} = fileDefinitionData || {};
    const data = sampleData || JSON.stringify(fieldState?.sampleData, null, 2);

    return {
      ...options,
      rule,
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
