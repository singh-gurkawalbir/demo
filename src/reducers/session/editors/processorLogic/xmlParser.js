import { wrapExportFileSampleData } from '../../../../utils/sampleData';

const parseNodes = nodesAsText => nodesAsText?.split?.('\n');

const requestBody = editor => {
  let options;

  if (editor.V0_json === false) {
    options = {
      V0_json: false,
      trimSpaces: editor.trimSpaces,
      stripNewLineChars: editor.stripNewLineChars,
    };

    if (editor.attributePrefix) options.attributePrefix = editor.attributePrefix;
    if (editor.textNodeName) options.textNodeName = editor.textNodeName;
    if (editor.listNodes) options.listNodes = parseNodes(editor.listNodes);
    if (editor.includeNodes) options.includeNodes = parseNodes(editor.includeNodes);
    if (editor.excludeNodes) options.excludeNodes = parseNodes(editor.excludeNodes);
  } else {
    // exports created in ampersand will have empty parsers object
    // which should be considered as automatic strategy
    options = { V0_json: true };
  }

  const rules = {
    resourcePath: editor.resourcePath,
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
    data: editor.data,
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
