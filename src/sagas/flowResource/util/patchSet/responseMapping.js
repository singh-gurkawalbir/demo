import responseMappingUtil from '../../../../utils/responseMapping';

export default {
  getPatchSet: value => {
    const {
      mappings,
      resourceIndex,
      resourceType,
      pageProcessor,
      resource,
      flowId,
    } = value;
    const patches = {
      foregroundPatch: undefined,
      // backgroundPatches: [],
    };
    const patchSet = [];
    const _mappings = mappings.map(({ rowIdentifier, ...others }) => others);
    const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(
      _mappings
    );

    if (
      pageProcessor &&
      pageProcessor[resourceIndex] &&
      pageProcessor[resourceIndex].responseMapping
    ) {
      const obj = {};

      obj.responseMapping = {};
      obj.type = resourceType === 'imports' ? 'import' : 'export';
      obj[resourceType === 'imports' ? '_importId' : '_exportId'] =
        resource._id;
      patchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}`,
        value: obj,
      });
    }

    patchSet.push({
      op: 'replace',
      path: `/pageProcessors/${resourceIndex}/responseMapping`,
      value: mappingsWithListsAndFields,
    });
    patches.foregroundPatch = {
      patch: patchSet,
      resourceType: 'flows',
      resourceId: flowId,
    };

    return patches;
  },
};
