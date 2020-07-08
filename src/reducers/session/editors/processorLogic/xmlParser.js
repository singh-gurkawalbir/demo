const parseNodes = nodesAsText => nodesAsText?.split('\n');

const requestBody = editor => {
  let options;

  if (editor.V0_json) {
    options = { V0_json: true };
  } else {
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

export default {
  validate,
  requestBody,
};
