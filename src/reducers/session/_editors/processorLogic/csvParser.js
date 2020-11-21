
import { wrapExportFileSampleData } from '../../../../utils/sampleData';

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

const init = editor => {
  const { rule = {}, ...others } = editor;

  rule.multipleRowsPerRecord = !!(rule.keyColumns && rule.keyColumns.length);

  return {
    ...others,
    rule,
  };
};

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
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
