export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
    };
    const { content, scriptId } = editor;

    patches.foregroundPatch = {
      patch: [
        {
          op: 'replace',
          path: '/content',
          value: content,
        },
      ],
      resourceType: 'scripts',
      resourceId: scriptId,
    };

    return patches;
  },
};
