import mappingUtil from './mapping';
import { adaptorTypeMap, isBlobTypeResource } from './resource';

export const actionsMap = {
  as2Routing: 'as2Routing',
  inputFilter: 'inputFilter',
  importMapping: 'importMapping',
  templateMapping: 'templateMapping',
  transformation: 'transformation',
  responseTransformation: 'responseTransformation',
  hooks: 'hooks',
  responseMapping: 'responseMapping',
  postResponseMap: 'postResponseMap',
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
  actionsMap.postResponseMap,
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
  actionsMap.postResponseMap,
  actionsMap.proceedOnFailure,
];
const isActionUsed = (resource, resourceType, flowNode, action) => {
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
    hooks: pageProcessorHooks = {},
    proceedOnFailure,
    schedule,
    _keepDeltaBehindFlowId,
  } = flowNode;

  switch (action) {
    case actionsMap.schedule:
      return !!(schedule || _keepDeltaBehindFlowId);
    case actionsMap.inputFilter: {
      const { type, expression = {}, script = {} } =
        resourceType === 'imports' ? filter : inputFilter;

      if (type === 'expression') {
        return !!(expression.rules && expression.rules.length);
      }

      // when filter is of type 'script', check for scriptId
      return !!script._scriptId;
    }

    case actionsMap.importMapping: {
      const mappings = mappingUtil.getMappingFromResource(resource, true);
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
    case actionsMap.transformation: {
      const { type, expression = {}, script = {} } = transform;

      if (type === 'expression') {
        // Infers based on the first ruleset { rules: [rule]}
        // @TODO: Raghu Change it if we support multiple transformation rules
        return !!(
          expression.rules &&
          expression.rules[0] &&
          expression.rules[0].length
        );
      }

      // when transformation is of type 'script', check for scriptId
      return !!script._scriptId;
    }

    case actionsMap.responseTransformation: {
      const { type, expression = {}, script = {} } = responseTransform;

      if (type === 'expression') {
        // Infers based on the first ruleset { rules: [rule]}
        // @TODO: Raghu Change it if we support multiple transformation rules
        return !!(
          expression.rules &&
          expression.rules[0] &&
          expression.rules[0].length
        );
      }

      // when transformation is of type 'script', check for scriptId
      return !!script._scriptId;
    }

    case actionsMap.hooks:
      return !!hooks;
    case actionsMap.responseMapping: {
      const { fields = [], lists = [] } = responseMapping;

      return !!(fields.length || lists.length);
    }

    case actionsMap.postResponseMap:
      return !!(
        pageProcessorHooks.postResponseMap &&
        pageProcessorHooks.postResponseMap._scriptId
      );

    case actionsMap.outputFilter: {
      const { type, expression = {}, script = {} } = filter;

      if (type === 'expression') {
        return !!(expression.rules && expression.rules.length);
      }

      // when filter is of type 'script', check for scriptId
      return !!script._scriptId;
    }

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
    usedActions[action] = isActionUsed(
      resource,
      resourceType,
      flowNode,
      action
    );
  });

  return usedActions;
};

export const isImportMappingAvailable = resource => {
  if (!resource) return false;
  // For Blob imports mapping shouldnot be shown.(IO-11865)

  if (isBlobTypeResource(resource)) {
    return false;
  }

  const { adaptorType, rdbms = {} } = resource;
  const appType = adaptorTypeMap[adaptorType];

  // if apptype is mongodb then mapping shouldnot be shown
  if (appType === 'mongodb') return false;

  // if apptype is rdbms and querytype is not bulk insert then mapping shouldnot be shown
  if (appType === 'rdbms' && rdbms.queryType !== 'BULK INSERT') {
    return false;
  }

  // for other app types mapping should be shown
  return true;
};

// Given a flow doc and resourceId , returns true if it is a page generator
// Returns falls if provided invalid flow doc
export const isPageGeneratorResource = (flow = {}, resourceId) => {
  const { pageGenerators = [] } = flow;

  return !!pageGenerators.find(pg => pg._exportId === resourceId);
};

/*
 * Based on _connectorId on flow Doc, we determine whether this flow is a connector
 */
export const isConnector = (flow = {}) => !!(flow && flow._connectorId);

/*
 * Based on free property on flow Doc, we determine whether this flow is a free flow
 */
export const isFreeFlowResource = (flow = {}) => !!(flow && flow.free);

/*
 * Returns true/false, whether passed resource is a lookup or not for the passed flow
 */
export const isLookupResource = (flow = {}, resource = {}) => {
  if (resource.isLookup) return true;
  const { pageProcessors = [] } = flow;

  return !!pageProcessors.find(pp => pp._exportId === resource._id);
};

/*
 * Returns true/false, whether passed flow follows an old schema
 */
export const isOldFlowSchema = ({
  pageGenerators,
  _exportId,
  pageProcessors,
  _importId,
}) => (!pageGenerators && _exportId) || (!pageProcessors && _importId);
