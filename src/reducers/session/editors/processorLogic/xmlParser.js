const parseNodes = nodesAsText => nodesAsText?.split('\n');

const requestBody = editor => {
  const rules = {
    resourcePath: editor.resourcePath,
    doc: {
      parsers: [
        {
          type: 'xml',
          version: 1,
          rules: {
            V0_json: editor.V0_json,
            trimSpaces: editor.trimSpaces,
            stripNewLineChars: editor.stripNewLineChars,
            attributePrefix: editor.attributePrefix,
            textNodeName: editor.textNodeName,
            listNodes: parseNodes(editor.listNodes),
            includeNodes: parseNodes(editor.includeNodes),
            excludeNodes: parseNodes(editor.excludeNodes),
          },
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
