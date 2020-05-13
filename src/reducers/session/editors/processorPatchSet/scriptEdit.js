export default {
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
    };
    const { code, scriptId } = editor;

    patches.foregroundPatches = {
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

    return patches;
  },
};
