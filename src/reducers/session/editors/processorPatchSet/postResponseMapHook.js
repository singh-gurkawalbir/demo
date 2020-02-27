export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
      backgroundPatches: [],
    };
    const { code, scriptId, entryFunction, optionalSaveParams } = editor;
    const { flowId, pageProcessorsObject, resourceIndex } =
      optionalSaveParams || {};
    const foregroundPatchSet = [];

    if (!pageProcessorsObject.hooks) {
      foregroundPatchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}/hooks`,
        value: {},
      });
    }

    // Saves postResponseMap Hook on pageProcessor based on resourceIndex
    // Incase of user selecting None for script, pass undefined instead of '' as BE throws error if it is ''
    foregroundPatchSet.push({
      op:
        pageProcessorsObject.hooks && pageProcessorsObject.hooks.postResponseMap
          ? 'replace'
          : 'add',
      path: `/pageProcessors/${resourceIndex}/hooks/postResponseMap`,
      value: {
        _scriptId: scriptId || undefined,
        function: scriptId ? entryFunction : undefined,
      },
    });
    patches.foregroundPatch = {
      patch: foregroundPatchSet,
      resourceType: 'flows',
      resourceId: flowId,
    };

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

    return patches;
  },
};
