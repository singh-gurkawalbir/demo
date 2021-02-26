export default {
  init: ({options, resource}) => ({
    ...options,
    rule: resource?.readme || '',
  }),
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  patchSet: editor => {
    const patches = {
      foregroundPatches: [],
    };
    const {
      resourceId,
      resourceType,
      rule,
    } = editor;

    patches.foregroundPatches.push({
      patch: [
        {
          op: 'replace',
          path: '/readme',
          value: rule,
        },
      ],
      resourceType,
      resourceId,
    });

    return patches;
  },
};

