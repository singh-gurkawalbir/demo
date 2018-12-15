const parseNodes = nodesAsText => {
  if (!nodesAsText) return;

  const nodes = nodesAsText.split('\n');

  console.log('parsed node text', nodes);

  return nodes;
};

const requestBody = editor => {
  const rules = {
    resourcePath: editor.resourcePath,
    doc: {
      parsers: [
        {
          type: 'xml',
          version: 1,
          rules: {
            V0_json: !editor.leanJson,
            trimSpaces: editor.trimSpaces,
            stripNewLineChars: editor.stripNewLineChars,
            attributePrefix: editor.attributePrefix,
            textNodeName: editor.textNodeName,
            listNodes: parseNodes(editor.listNodes),
          },
        },
      ],
    },
  };

  return {
    data: editor.data,
    rules,
  };
};

const validate = editor => ({
  dataError:
    !editor.data && !editor.data.length && 'Must provide some sample data.',
});

export default {
  validate,
  requestBody,
};
