import MappingUtil from './mapping';
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
};
const exportActions = [
  actionsMap.inputFilter,
  actionsMap.transformation,
  actionsMap.hooks,
  actionsMap.outputFilter,
  actionsMap.responseMapping,
  actionsMap.proceedOnFailure,
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
    responseTransform = {},
  } = resource;
  const { responseMapping = {}, proceedOnFailure } = flowNode;

  switch (action) {
    case actionsMap.inputFilter:
      return !!(inputFilter.rules && inputFilter.rules.length);

    case actionsMap.importMapping: {
      const appType =
        resource.adaptorType && adaptorTypeMap[resource.adaptorType];
      const mappings = MappingUtil.getMappingFromResource(
        resource,
        appType,
        true
      );
      const { fields = [], lists = [] } = mappings || {};

      return !!(fields.length || lists.length);
    }

    case actionsMap.templateMapping:
      return false;
    case actionsMap.transformation:
      return !!(transform.rules && transform.rules.length);

    case actionsMap.responseTransformation:
      return responseTransform.rules && responseTransform.rules.length;

    case actionsMap.hooks:
      return false;
    case actionsMap.responseMapping: {
      const { fields = [], lists = [] } = responseMapping;

      return fields.length || lists.length;
    }

    case actionsMap.outputFilter:
      return filter.rules && filter.rules.length;

    case actionsMap.proceedOnFailure:
      return proceedOnFailure;

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
