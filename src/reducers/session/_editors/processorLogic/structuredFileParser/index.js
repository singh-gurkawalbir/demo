import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';

export default {
  init: ({options, fieldState, fileDefinitionData}) => {
    const {sampleData, rule} = fileDefinitionData || {};
    const data = sampleData || fieldState?.sampleData;

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
    data: editor.data,
  }),
  validate: editor => ({
    ruleError: util.validateJsonString(editor.rule),
    dataError:
      (!editor.data || (editor.data && !editor.data.length)) &&
      'Must provide some sample data.',
  }),
};
