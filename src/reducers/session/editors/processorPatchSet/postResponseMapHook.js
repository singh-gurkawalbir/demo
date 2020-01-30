export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
      backgroundPatches: [],
    };
    const { code, scriptId, entryFunction, optionalSaveParams } = editor;
    const { flowId, pageProcessorsObject, resourceIndex } =
      optionalSaveParams || {};

    patches.foregroundPatch = {
      patch: [
        {
          op: 'replace',
          path: '/content',
          value: code,
        },
      ],
      resourceType: 'scripts',
      resourceId: scriptId,
    };

    const backgroundPatchSet = [];

    if (!pageProcessorsObject.hooks) {
      backgroundPatchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}/hooks`,
        value: {},
      });
    }

    // Saves postResponseMap Hook on pageProcessor based on resourceIndex
    backgroundPatchSet.push({
      op:
        pageProcessorsObject.hooks && pageProcessorsObject.hooks.postResponseMap
          ? 'replace'
          : 'add',
      path: `/pageProcessors/${resourceIndex}/hooks/postResponseMap`,
      value: { _scriptId: scriptId, function: entryFunction },
    });

    patches.backgroundPatches.push({
      patch: backgroundPatchSet,
      resourceType: 'flows',
      resourceId: flowId,
    });

    return patches;
  },
};
