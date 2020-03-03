export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
      backgroundPatches: [],
    };
    const {
      processor,
      rule,
      scriptId,
      code,
      entryFunction,
      optionalSaveParams = {},
    } = editor;
    const { resourceId, resourceType } = optionalSaveParams;
    const type = processor === 'transform' ? 'expression' : 'script';
    const path = '/transform';
    const value = {
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

    patches.foregroundPatch = {
      patch: [{ op: 'replace', path, value }],
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
