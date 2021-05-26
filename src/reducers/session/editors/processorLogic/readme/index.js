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
    const {
      resourceId,
      resourceType,
      rule,
    } = editor;

    const patches = {
      foregroundPatches: [{
        patch: [
          {
            op: 'replace',
            path: '/readme',
            value: rule,
          },
        ],
        resourceType,
        resourceId,
      }],
    };

    return patches;
  },
};

