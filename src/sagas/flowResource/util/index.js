import responseMappingUtil from '../../../utils/responseMapping';
import responseMappingPatch from './patchSet/responseMapping';

export default {
  getPatchSet: (flowResource = {}) => {
    const { type } = flowResource;

    if (responseMappingUtil[type] === responseMappingUtil.RESPONSE_MAPPING) {
      return responseMappingPatch.getPatchSet(flowResource);
    }
  },
};
