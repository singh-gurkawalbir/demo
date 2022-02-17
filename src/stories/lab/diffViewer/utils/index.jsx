export const getResourceLevelChanges = overallDiff => {
  const { numConflicts, current, merged } = overallDiff;
  const diffs = {};
  const resourcesTypes = Object.keys(merged);

  resourcesTypes.forEach(resourceType => {
    if (!diffs[resourceType]) {
      diffs[resourceType] = [];
    }
    const resources = merged[resourceType];

    Object.keys(resources).forEach(id => {
      const [resourceId, action = 'update'] = id.split('.');
      const resourceDiff = { resourceId, action };
      const {$conflicts, ...rest} = merged[resourceType][id];
      // TODO: confirm on script diffs - we do show script changes but not script name as of now
      const mergedContent = resourceType === 'script' ? (rest['$blob.conflict'] || rest.$blob) : rest;
      const currentContent = resourceType === 'script' ? current[resourceType][resourceId]?.$blob : current[resourceType][resourceId];

      if (action === 'new') {
        resourceDiff.after = mergedContent;
      } else if (action === 'deleted') {
        resourceDiff.before = currentContent;
      } else {
        if (action === 'conflict') {
          resourceDiff.conflicts = $conflicts;
        }
        resourceDiff.after = mergedContent;
        resourceDiff.before = currentContent;
      }
      diffs[resourceType].push(resourceDiff);
    });
  });

  return { numConflicts, diffs };
};
