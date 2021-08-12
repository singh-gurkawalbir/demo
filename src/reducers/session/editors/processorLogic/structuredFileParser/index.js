import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';

export default {
  init: ({options, fieldState, fileDefinitionData}) => {
    const {sampleData, rule} = fileDefinitionData || {};
    const data = sampleData || fieldState?.sampleData;

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
  requestBody: editor => {
    const rules = {
      groupByFields: editor.groupByFields,
      sortByFields: editor.sortByFields,
      ...JSON.parse(editor.rule)};

    return {
      rules,
      data: editor.data,
    };
  },
  validate: editor => ({
    ruleError: util.validateJsonString(editor.rule),
    dataError:
      (!editor.data || (editor.data && !editor.data.length)) &&
      'Must provide some sample data.',
  }),
};
