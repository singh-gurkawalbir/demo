
import { wrapExportFileSampleData } from '../../../../../utils/sampleData';

const requestBody = ({ rule, data }) => {
  const rules = {
    ...rule,
    rowsToSkip: Number.isInteger(rule.rowsToSkip) ? rule.rowsToSkip : 0,
  };

  return {
    rules,
    data,
    options: { includeEmptyValues: true },
  };
};

const init = props => {
  const {options, fieldState, resource} = props;
  const value = fieldState?.value || {};
  let rule = value;

  if (!('trimSpaces' in value)) {
    rule = {...value, trimSpaces: true};
  }

  rule.multipleRowsPerRecord = !!rule.keyColumns?.length;
  rule.groupByFields = resource?.file?.groupByFields || [];
  rule.sortByFields = resource?.file?.sortByFields || [];

  return {
    ...options,
    rule: options.rule || rule,
  };
};

const validate = editor => ({
  dataError:
    !editor.data?.length && 'Must provide some sample data.',
});

const processResult = ({ isSuiteScriptData }, result) => {
  if (isSuiteScriptData) return result;
  const formattedData = wrapExportFileSampleData(result?.data);

  return {...result, data: formattedData, columnsData: result?.data};
};

export default {
  validate,
  requestBody,
  init,
  processResult,
};
