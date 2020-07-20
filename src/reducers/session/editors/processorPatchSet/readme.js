export default {
  patchSet: editor => {
    const patches = {
      foregroundPatches: [],
    };
    const {
      integrationId,
      data,
    } = editor;

    patches.foregroundPatches.push({
      patch: [
        {
          op: 'replace',
          path: '/readme',
          value: data,
        },
      ],
      resourceType: 'integrations',
      resourceId: integrationId,
    });

    return patches;
  },
};
