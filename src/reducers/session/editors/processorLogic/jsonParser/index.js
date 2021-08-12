
import { wrapExportFileSampleData } from '../../../../../utils/sampleData';

const requestBody = ({ rule, data }) => {
  const rules = {
    resourcePath: rule.resourcePath,
    groupByFields: rule.groupByFields,
    sortByFields: rule.sortByFields,
  };

  return {
    rules,
    data,
  };
};

const init = () => {};
const validate = () => true;

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
