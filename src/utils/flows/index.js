import mappingUtil from '../mapping';
import { adaptorTypeMap, isBlobTypeResource } from '../resource';

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
  if (appType === 'rdbms' && rdbms.queryType.indexOf('BULK INSERT') === -1) {
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

export function isRealtimeExport(exp) {
  if (!exp) return false;

  // AS2 Exports are real-time.
  if (exp.adaptorType === 'AS2Export') return true;

  // webhook and distributed are realtime.
  if (exp.type && ['distributed', 'webhook'].includes(exp.type)) {
    return true;
  }

  // all others are not realtime or unknown.
  return false;
}

export function hasBatchExport(exports, simpleExp, flow) {
  if (flow && flow._exportId) {
    return !isRealtimeExport(simpleExp);
  }

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    return flow.pageGenerators.some(pg => {
      const exp = exports.find(exp => exp._id === pg._exportId);

      return !isRealtimeExport(exp);
    });
  }

  return false;
}

export function isSimpleImportFlow(exp) {
  return exp && exp.type === 'simple';
}

export function showScheduleIcon(exports, exp, flow) {
  if (isSimpleImportFlow(exp)) return false;

  return hasBatchExport(exports, exp, flow);
}

export function isRunnable(exports, exp, flow) {
  const isDataLoader = isSimpleImportFlow(exp);

  // invalid flows are not runnable.
  if (!flow) {
    return false;
  }

  // For disabled flows
  if (flow.disabled) {
    // All iA flows are not runnable if disabled
    // For DIY flows, dataloader flows can be runnable
    if (flow._connectorId || !isDataLoader) {
      return false;
    }
  }

  const flowHasExport =
    !!flow._exportId ||
    (flow.pageGenerators && flow.pageGenerators.some(pg => pg._exportId));

  // flows need at least one export to be runnable
  if (!flowHasExport) return false;

  const flowHasImport =
    !!flow._importId ||
    (flow.pageProcessors &&
      flow.pageProcessors.some(pg => pg._exportId || pg._importId));

  // flows need at least one import to be runnable
  if (!flowHasImport) return false;

  // as long as we have an imp and exp a data loader is runnable
  if (isDataLoader) return true;

  // flows need at least one export which is not real-time to be runnable.
  if (!hasBatchExport(exports, exp, flow)) {
    return false;
  }

  // finally, we must thus be runnable.
  return true;
}

export function getExportIdsFromFlow(flow) {
  const exportIds = [];

  if (!flow) {
    return exportIds;
  }

  if (flow._exportId) {
    exportIds.push(flow._exportId);
  }

  if (flow.pageGenerators && flow.pageGenerators.length > 0) {
    flow.pageGenerators.forEach(pg => {
      if (pg._exportId) {
        exportIds.push(pg._exportId);
      }
    });
  }

  if (flow.pageProcessors && flow.pageProcessors.length > 0) {
    flow.pageProcessors.forEach(pp => {
      if (pp._exportId) {
        exportIds.push(pp._exportId);
      }
    });
  }

  return exportIds;
}

export function getImportIdsFromFlow(flow) {
  const importIds = [];

  if (!flow) {
    return importIds;
  }

  if (flow._importId) {
    importIds.push(flow._importId);
  }

  if (flow.pageProcessors && flow.pageProcessors.length > 0) {
    flow.pageProcessors.forEach(pp => {
      if (pp._importId) {
        importIds.push(pp._importId);
      }
    });
  }

  return importIds;
}
