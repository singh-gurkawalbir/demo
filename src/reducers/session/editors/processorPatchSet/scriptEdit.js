export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
    };
    const { code, scriptId } = editor;

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

    return patches;
  },
};
