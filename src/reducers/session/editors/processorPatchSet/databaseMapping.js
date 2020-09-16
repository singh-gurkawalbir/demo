export default {
  patchSet: editor => {
    const {
      template,
      defaultData,
      lookups,
      optionalSaveParams = {},
    } = editor;
    const { resourceId, resourceType, queryIndex, query } = optionalSaveParams || {};
    const patches = [
      {
        op: 'replace',
        path: '/rdbms/lookups',
        value: lookups,
      },
    ];

    try {
      const parsedDefaultData = JSON.parse(defaultData);

      if (parsedDefaultData.data) {
        patches.push({
          op: 'replace',
          path: '/modelMetadata',
          value: parsedDefaultData.data,
        });
      }
    } catch (e) {
      // do nothing
    }
    const modifiedQuery = [...query];

    modifiedQuery[queryIndex] = template;
    patches.push({
      op: 'replace',
      path: '/rdbms/query',
      value: modifiedQuery,
    });

    return {
      foregroundPatches: {
        patch: patches,
        resourceType,
        resourceId,
      }};
  },
};
