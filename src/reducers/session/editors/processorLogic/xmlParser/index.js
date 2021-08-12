import { wrapExportFileSampleData } from '../../../../../utils/sampleData';

const init = ({resource, fieldState, options}) => {
  const { value } = fieldState || {};
  const resourcePath = resource?.file?.xml?.resourcePath;
  const rule = {
    resourcePath,
    ...value?.[0]?.rules,
  };

  return {
    ...options,
    rule: options.rule || {
      // eslint-disable-next-line camelcase
      V0_json: rule.V0_json === true || false,
      resourcePath: rule.resourcePath,
      trimSpaces: rule.trimSpaces,
      stripNewLineChars: rule.stripNewLineChars,
      attributePrefix: rule.attributePrefix,
      textNodeName: rule.textNodeName,
      listNodes: rule.listNodes,
      includeNodes: rule.includeNodes,
      excludeNodes: rule.excludeNodes,
    },
  };
};

const requestBody = ({ data, rule = {} }) => {
  let options;

  if (rule.V0_json === false) {
    options = {
      V0_json: false,
      trimSpaces: rule.trimSpaces,
      stripNewLineChars: rule.stripNewLineChars,
    };

    if (rule.attributePrefix) options.attributePrefix = rule.attributePrefix;
    if (rule.textNodeName) options.textNodeName = rule.textNodeName;
    if (rule.listNodes) options.listNodes = rule.listNodes;
    if (rule.includeNodes) options.includeNodes = rule.includeNodes;
    if (rule.excludeNodes) options.excludeNodes = rule.excludeNodes;
  } else {
    // exports created in ampersand will have empty parsers object
    // which should be considered as automatic strategy
    options = { V0_json: true };
  }

  const rules = {
    resourcePath: rule.resourcePath,
    groupByFields: rule.groupByFields,
    sortByFields: rule.sortByFields,
    doc: {
      parsers: [
        {
          type: 'xml',
          version: 1,
          rules: options,
        },
      ],
    },
  };

  return {
    data,
    rules,
    options: { isSimplePath: true },
  };
};

const validate = editor => ({
  dataError:
    !editor.data?.length && 'Must provide some sample data.',
});

const processResult = ({ isSuiteScriptData }, result) => {
  if (isSuiteScriptData) return result;

  // xml parse output is expected to be wrapped inside data[0]
  const formattedData = wrapExportFileSampleData(result?.data?.[0]);

  return {...result, data: [formattedData]};
};

export default {
  validate,
  requestBody,
  processResult,
  init,
};
