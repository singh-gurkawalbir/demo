/*
 * Creates transform rules as per required format to be saved
 */
const constructTransformData = values => {
  const { processor, rule, scriptId, entryFunction } = values;
  const type = processor === 'transform' ? 'expression' : 'script';

  return {
    type,
    expression: {
      version: 1,
      rules: rule ? [rule] : [[]],
    },
    script: {
      _scriptId: scriptId,
      function: entryFunction,
    },
  };
};

export default {
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };
    const responseTransform = constructTransformData(editor);
    const {
      code,
      scriptId,
      type,
      data: sampleResponseData,
      optionalSaveParams = {},
    } = editor;
    const { resourceId, resourceType } = optionalSaveParams;

    patches.foregroundPatches = {
      patch: [
        {
          op: 'replace',
          path: '/sampleResponseData',
          value: sampleResponseData,
        },
        {
          op: 'replace',
          path: '/responseTransform',
          value: responseTransform,
        },
      ],
      resourceType,
      resourceId,
    };

    if (type === 'script') {
      patches.backgroundPatches.push({
        patch: [
          {
            op: 'replace',
            path: '/content',
            value: code,
          },
        ],
        resourceType: 'scripts',
        resourceId: scriptId,
      });
    }

    return patches;
  },
};
