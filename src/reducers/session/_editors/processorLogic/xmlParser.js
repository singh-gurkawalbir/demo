import { wrapExportFileSampleData } from '../../../../utils/sampleData';

const parseNodes = nodesAsText => nodesAsText?.split('\n');

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
    if (rule.listNodes) options.listNodes = parseNodes(rule.listNodes);
    if (rule.includeNodes) options.includeNodes = parseNodes(rule.includeNodes);
    if (rule.excludeNodes) options.excludeNodes = parseNodes(rule.excludeNodes);
  } else {
    // exports created in ampersand will have empty parsers object
    // which should be considered as automatic strategy
    options = { V0_json: true };
  }

  const rules = {
    resourcePath: rule.resourcePath,
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
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
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
};
