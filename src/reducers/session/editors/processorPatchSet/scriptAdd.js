export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
    };
    const { name, description, content, scriptId } = editor;

    patches.foregroundPatch = {
      patch: [
        {
          op: 'add',
          path: '/name',
          value: name,
        },
        {
          op: 'add',
          path: '/description',
          value: description,
        },
        {
          op: 'add',
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
