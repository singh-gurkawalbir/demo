import mappingUtil from './mapping';
import { adaptorTypeMap } from './resource';

export const actionsMap = {
  inputFilter: 'inputFilter',
  importMapping: 'importMapping',
  templateMapping: 'templateMapping',
  transformation: 'transformation',
  responseTransformation: 'responseTransformation',
  hooks: 'hooks',
  responseMapping: 'responseMapping',
  outputFilter: 'outputFilter',
  proceedOnFailure: 'proceedOnFailure',
  schedule: 'schedule',
};
const exportActions = [
  actionsMap.inputFilter,
  actionsMap.transformation,
  actionsMap.hooks,
  actionsMap.outputFilter,
  actionsMap.responseMapping,
  actionsMap.proceedOnFailure,
  actionsMap.schedule,
];
const importActions = [
  actionsMap.inputFilter,
  actionsMap.importMapping,
  actionsMap.templateMapping,
  actionsMap.responseTransformation,
  actionsMap.hooks,
  actionsMap.outputFilter,
  actionsMap.responseMapping,
  actionsMap.proceedOnFailure,
];
const isActionUsed = (resource, flowNode, action) => {
  const {
    inputFilter = {},
    filter = {},
    transform = {},
    hooks,
    responseTransform = {},
    http = {},
  } = resource;
  const {
    responseMapping = {},
    proceedOnFailure,
    schedule,
    _keepDeltaBehindFlowId,
  } = flowNode;

  switch (action) {
    case actionsMap.schedule:
      return !!(schedule || _keepDeltaBehindFlowId);
    case actionsMap.inputFilter:
      return !!(inputFilter.rules && inputFilter.rules.length);

    case actionsMap.importMapping: {
      const appType =
        resource.adaptorType && adaptorTypeMap[resource.adaptorType];
      const mappings = mappingUtil.getMappingFromResource(
        resource,
        appType,
        true
      );
      const { fields = [], lists = [] } = mappings || {};

      return !!(fields.length || lists.length);
    }

    case actionsMap.templateMapping:
      return !!(
        http &&
        http.body &&
        (typeof http.body === 'string' ||
          (Array.isArray(http.body) && http.body.length))
      );
    case actionsMap.transformation:
      // Infers based on the first ruleset { rules: [rule]}
      // @TODO: Raghu Change it if we support multiple transformation rules
      return !!(
        transform.rules &&
        transform.rules[0] &&
        transform.rules[0].length
      );

    case actionsMap.responseTransformation:
      return !!(
        responseTransform.rules &&
        responseTransform.rules[0] &&
        responseTransform.rules[0].length
      );

    case actionsMap.hooks:
      return !!hooks;
    case actionsMap.responseMapping: {
      const { fields = [], lists = [] } = responseMapping;

      return !!(fields.length || lists.length);
    }

    case actionsMap.outputFilter:
      return !!(filter.rules && filter.rules.length);

    case actionsMap.proceedOnFailure:
      return !!proceedOnFailure;

    default:
  }
};

export const getUsedActionsMapForResource = (
  resource = {},
  resourceType = 'exports',
  flowNode = {}
) => {
  const actions = resourceType === 'exports' ? exportActions : importActions;
  const usedActions = {};

  actions.forEach(action => {
    usedActions[action] = isActionUsed(resource, flowNode, action);
  });

  return usedActions;
};
