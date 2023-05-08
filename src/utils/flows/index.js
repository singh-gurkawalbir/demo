import produce from 'immer';
import url from 'url';
import qs from 'query-string';
import invert from 'lodash/invert';
import { keys, map, uniq } from 'lodash';
import { deepClone } from 'fast-json-patch/lib/core';
import mappingUtil from '../mapping';
import {
  adaptorTypeMap,
  isBlobTypeResource,
  isValidResourceReference,
} from '../resource';
import { emptyList, emptyObject, STANDALONE_INTEGRATION, JOB_STATUS, UNASSIGNED_SECTION_ID, UNASSIGNED_SECTION_NAME } from '../../constants';
import { JOB_UI_STATUS } from '../jobdashboard';
import getRoutePath from '../routePaths';
import {HOOKS_IN_IMPORT_EXPORT_RESOURCE} from '../scriptHookStubs';

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
export const defaultIA2Flow = {showMapping: true, showStartDateDialog: true, showSchedule: true};

export const getAllPageProcessors = flow => {
  const pageProcessors = [];

  if (!flow) return [];
  if (flow.routers?.length) {
    flow.routers.forEach(router => {
      router.branches?.forEach(branch => {
        branch.pageProcessors?.forEach(pp => pageProcessors.push(pp));
      });
    });
  } else if (flow.pageProcessors?.length) {
    flow.pageProcessors.forEach(pp => pageProcessors.push(pp));
  }

  return pageProcessors;
};

export const isActionUsed = (resource, resourceType, flowNode, action) => {
  const {
    inputFilter = {},
    filter = {},
    transform = {},
    hooks,
    responseTransform = {},
    http = {},
    netsuite = {},
    netsuite_da = {}, // eslint-disable-line camelcase
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
      // v2 mappings
      if (resource.mappings?.length) {
        return true;
      }

      // v1 mappings
      const mappings = mappingUtil.getMappingFromResource({
        importResource: resource,
        isFieldMapping: true,
      });
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

    case actionsMap.hooks: {
      // for NS exports hooks(suitescript) will be stored in netsuite -> restlet/distributed schema
      // and for NS imports hooks is stored in netsuite_da schema

      /* TODO: remove the preSend checks once BE fixes IO-17088 and
         IO-6602(confirm with BE on this as they still haven't removed batchSize from restlet.hooks object)
      */
      return !!hooks || !!netsuite.restlet?.hooks?.preSend || !!netsuite.distributed?.hooks?.preSend?.function || !!netsuite_da.hooks;
    }
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

export const isImportMappingAvailable = importResource => {
  if (!importResource) return false;
  // For Blob imports mapping should not be shown.(IO-11865)
  if (isBlobTypeResource(importResource)) {
    return false;
  }
  const { adaptorType, rdbms = {} } = importResource;
  const appType = adaptorTypeMap[adaptorType];

  // if apptype is mongodb then mapping should not be shown
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
 * Based on _connectorId on resource doc, we determine whether this is an Integration App resource
 */
export const isIntegrationApp = (doc = {}) => !!(doc && doc._connectorId);

/*
 * Based on free property on flow Doc, we determine whether this flow is a free flow
 */
export const isFreeFlowResource = (flow = {}) => !!(flow && flow.free);

export function isSetupInProgress(flow) {
  if (!flow) return false;
  const isPageGeneratorSetupInProgress = (flow.pageGenerators || []).some(pg => pg.setupInProgress) || !flow.pageGenerators?.length;
  const arePPsEmpty = !flow.pageProcessors || !flow.pageProcessors.length;
  const areRoutersEmpty = !flow.routers || !flow.routers.length;

  const isPageProcessorSetupInProgress = (flow.pageProcessors || []).some(pp => pp.setupInProgress);
  const isRouterSetupInProgress = (flow.routers || [])
    .some(router => (router.branches || [])
      .some(branch => (branch.pageProcessors || [])
        .some(pp => pp.setupInProgress)));
  const noPageProcessorInRouters = flow.routers
    ? !(flow.routers || [])
      .some(router => (router.branches || [])
        .some(branch => (branch.pageProcessors || []).length > 0))
    : false;

  return isPageGeneratorSetupInProgress || isPageProcessorSetupInProgress || isRouterSetupInProgress || (arePPsEmpty && areRoutersEmpty) || noPageProcessorInRouters;
}

/*
 * Returns true/false, whether passed flow follows an old schema
 */
export const isOldFlowSchema = ({
  pageGenerators,
  _exportId,
  pageProcessors,
  _importId,
}) => !!((!pageGenerators && _exportId) || (!pageProcessors && _importId));

export function getFirstExportFromFlow(flow = {}, exports = []) {
  const exportId =
    flow.pageGenerators && flow.pageGenerators.length
      ? flow.pageGenerators[0]._exportId
      : flow._exportId;
  const pg = exports.find(e => e._id === exportId);

  return pg;
}

export function isRealtimeExport(exp) {
  if (!exp) return false;

  // AS2 and VAN Exports are real-time.
  if (exp.adaptorType === 'AS2Export' || exp.adaptorType === 'VANExport') return true;

  // webhook and distributed are realtime.
  if (exp.type && ['distributed', 'webhook'].includes(exp.type)) {
    return true;
  }

  // all others are not realtime or unknown.
  return false;
}

export function isRealtimeFlow(flow, exports, flowExports) {
  const exp = (flowExports?.length && flowExports[0]) || getFirstExportFromFlow(flow, exports);

  return isRealtimeExport(exp);
}

export function hasBatchExport(flow, exports = [], flowExports) {
  const exp = (flowExports?.length && flowExports[0]) || getFirstExportFromFlow(flow, exports);

  if (isOldFlowSchema(flow)) {
    return !isRealtimeExport(exp);
  }

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    if (flowExports?.length) {
      return !!flowExports.some(exp => !isRealtimeExport(exp));
    }

    return !!flow.pageGenerators.some(pg => {
      const exp = exports.find(exp => exp._id === pg._exportId);

      return !isRealtimeExport(exp);
    });
  }

  return false;
}

export function isSimpleImportFlow(flow, exports, flowExports) {
  const exp = (flowExports?.length && flowExports[0]) || getFirstExportFromFlow(flow, exports);

  return !!(exp && exp.type === 'simple');
}

export function flowbuilderUrl(flowId, integrationId, { childId, isIntegrationApp, isDataLoader, appName, sectionId}) {
  const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

  let flowBuilderTo;

  if (isIntegrationApp) {
    if (childId) {
      if (sectionId) {
        flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${childId}/flows/sections/${sectionId}/${flowBuilderPathName}/${flowId}`);
      } else {
        flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${childId}/${flowBuilderPathName}/${flowId}`);
      }
    } else if (sectionId) {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/flows/sections/${sectionId}/${flowBuilderPathName}/${flowId}`);
    } else {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`);
    }
  } else if (sectionId && integrationId !== 'none') {
    flowBuilderTo = getRoutePath(`/integrations/${integrationId}/flows/sections/${sectionId}/${flowBuilderPathName}/${flowId}`);
  } else {
    flowBuilderTo = getRoutePath(`/integrations/${integrationId || 'none'}/${flowBuilderPathName}/${flowId}`);
  }

  return flowBuilderTo;
}

export function showScheduleIcon(flow, exports, flowExports) {
  if (isSimpleImportFlow(flow, exports, flowExports)) return false;

  return hasBatchExport(flow, exports, flowExports);
}

export function flowAllowsScheduling(flow, integration, allExports, isAppVersion2, flowExports, childId) {
  if (!flow) return false;
  const isApp = flow._connectorId;
  const canSchedule = showScheduleIcon(flow, allExports, flowExports);

  // For IA2.0, 'showSchedule' is assumed true for now until we have more clarity
  if (!isApp || isAppVersion2) return canSchedule;
  // eslint-disable-next-line no-use-before-define
  const flowSettings = getIAFlowSettings(integration, flow._id, childId);

  return canSchedule && !!flowSettings.showSchedule;
}

export function getFlowType(flow, exports, flowExports) {
  if (!flow) return '';
  if (!exports && !flowExports) return '';
  if (isSimpleImportFlow(flow, exports, flowExports)) return 'Data loader';
  if (isRealtimeFlow(flow, exports, flowExports)) return 'Realtime';

  // TODO: further refine this logic to differentiate between 'Scheduled'
  // and 'mixed'. Note that mixed is the case where some exports are scheduled
  // and others are not.
  return 'Scheduled';
}

export function flowSupportsSettings(flow, integration, childId) {
  if (!flow) return false;
  const isApp = flow._connectorId;

  if (!isApp) return false;
  // eslint-disable-next-line no-use-before-define
  const flowSettings = getIAFlowSettings(integration, flow._id, childId);

  return !!(
    (flowSettings?.settings && flowSettings.settings.length) ||
    (flowSettings?.sections && flowSettings.sections.length)
  );
}

export function isRunnable(flow, exports) {
  const isDataLoader = isSimpleImportFlow(flow, exports);

  // invalid flows are not runnable.
  if (!flow) {
    return false;
  }

  // For disabled flows
  if (flow.disabled) {
    // All IA and DIY (including data loader) flows are not runnable if disabled
    return false;
  }

  const flowHasExport =
    !!flow._exportId ||
    (flow.pageGenerators && flow.pageGenerators.some(pg => pg._exportId));

  // flows need at least one export to be runnable
  if (!flowHasExport) return false;

  const flowHasImport =
    !!flow._importId ||
    (flow.pageProcessors && flow.pageProcessors.some(pg => pg._exportId || pg._importId)) ||
    (flow.routers && flow.routers.length);

  // flows need at least one import to be runnable
  if (!flowHasImport) return false;

  // as long as we have an imp and exp a data loader is runnable
  if (isDataLoader) return true;

  // flows need at least one export which is not real-time to be runnable.
  if (!hasBatchExport(flow, exports)) {
    return false;
  }
  if (isSetupInProgress(flow)) return false;

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

  const pageProcessors = getAllPageProcessors(flow);

  if (pageProcessors.length > 0) {
    pageProcessors.forEach(pp => {
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

  const pageProcessors = getAllPageProcessors(flow);

  if (pageProcessors.length > 0) {
    pageProcessors.forEach(pp => {
      if (pp._importId) {
        importIds.push(pp._importId);
      }
    });
  }

  return importIds;
}

export function isDeltaFlow(flow, exports) {
  if (!flow) return false;
  let isDeltaFlow = false;

  if (flow && flow._exportId) {
    const exp = exports && exports.find(e => e._id === flow._exportId);

    if (exp && exp.type === 'delta') {
      isDeltaFlow = true;
    }

    return isDeltaFlow;
  }

  flow &&
    flow.pageGenerators &&
    flow.pageGenerators.forEach(pg => {
      const flowExp = exports && exports.find(e => e._id === pg._exportId);

      if (flowExp && flowExp.type === 'delta') {
        isDeltaFlow = true;
      }
    });

  return isDeltaFlow;
}

export function getImportsFromFlow(flow, imports) {
  const importIds = [];

  if (!flow || !imports || imports.length === 0) return emptyList;

  if (flow._importId) {
    importIds.push(flow._importId);
  } else if (flow.pageProcessors && flow.pageProcessors.length) {
    flow.pageProcessors.forEach(p => {
      if (p._importId) {
        importIds.push(p._importId);
      }
    });
  } else if (flow.routers && flow.routers.length) {
    flow.routers.forEach(router => {
      router.branches?.forEach(branch => {
        branch.pageProcessors?.forEach(pp => {
          if (pp._importId) {
            importIds.push(pp._importId);
          }
        });
      });
    });
  }

  if (!importIds.length) return emptyList;

  return imports.filter(i => importIds.indexOf(i._id) > -1);
}

export function getNextDataFlows(flows = emptyList, exports = emptyList, flow = emptyObject) {
  const { _integrationId } = flow;
  // Incase of standalone Integrations, _integrationId is undefined for flow resources
  const flowIntegrationId =
    _integrationId === STANDALONE_INTEGRATION ? undefined : _integrationId;

  // Returns all valid flows under this integration
  return flows.map(item => ({
    isRealtime: isRealtimeFlow(item, exports),
    isSimpleImport: isSimpleImportFlow(item, exports),
    ...item,
  })).filter(
    f =>
      f._integrationId === flowIntegrationId &&
      f._id !== flow._id &&
      !f.isRealtime &&
      !f.isSimpleImport &&
      !f.disabled
  );
}

export function getAllConnectionIdsUsedInTheFlow(flow, connections, exports, imports, options = {}) {
  const exportIds = getExportIdsFromFlow(flow);
  const importIds = getImportIdsFromFlow(flow);
  const connectionIds = [];

  if (!flow) {
    return [];
  }

  const attachedExports =
    exports && exports.filter(e => exportIds.indexOf(e._id) > -1);
  const attachedImports =
    imports && imports.filter(i => importIds.indexOf(i._id) > -1);

  attachedExports.forEach(exp => {
    if (exp && exp._connectionId) {
      connectionIds.push(exp._connectionId);
    }
  });
  attachedImports.forEach(imp => {
    if (imp && imp._connectionId) {
      connectionIds.push(imp._connectionId);
    }
  });

  const attachedConnections =
    connections &&
    connections.filter(conn => connectionIds.indexOf(conn._id) > -1);

  if (!options.ignoreBorrowedConnections) {
    attachedConnections.forEach(conn => {
      if (conn && conn._borrowConcurrencyFromConnectionId) {
        connectionIds.push(conn._borrowConcurrencyFromConnectionId);
      }
    });
  }

  return uniq(connectionIds);
}

export function getIAResources(integrationResource = {}, allFlows, allConnections, allExports, allImports, options = {}) {
  const { supportsMultiStore, sections } = integrationResource?.settings || {};
  const { integrationId, childId, ignoreUnusedConnections } = options;
  const integrationConnections = allConnections.filter(c => c._integrationId === integrationId);
  const integrationFlows = allFlows.filter(f => f._integrationId === integrationId);

  if (!supportsMultiStore || !childId) {
    return {
      connections: integrationConnections,
      flows: integrationFlows,
    };
  }

  const flows = [];
  const flowIds = [];
  const allFlowIds = [];
  const connections = [];
  const flowConnections = [];
  const exports = [];
  const imports = [];
  const selectedChild = (sections || []).find(s => s.id === childId) || {};

  (selectedChild.sections || []).forEach(sec => {
    flowIds.push(...map(sec.flows, '_id'));
  });
  (sections || []).forEach(child => {
    (child.sections || []).forEach(sec => {
      allFlowIds.push(...map(sec.flows, '_id'));
    });
  });
  allFlowIds.forEach(fid => {
    const flow = integrationFlows.find(f => f._id === fid) || {};

    flowConnections.push(...getAllConnectionIdsUsedInTheFlow(flow, allConnections, allExports, allImports, options));
  });
  const unUsedConnections = integrationConnections.filter(c => !flowConnections.includes(c._id));

  flowIds.forEach(fid => {
    const flow = integrationFlows.find(f => f._id === fid);

    if (flow) {
      flows.push({_id: flow._id, name: flow.name});
      connections.push(...getAllConnectionIdsUsedInTheFlow(flow, allConnections, allExports, allImports, options));
      exports.push(...getExportIdsFromFlow(flow));
      imports.push(...getImportIdsFromFlow(flow));
    }
  });

  const usedConnections = integrationConnections.filter(c => connections.includes(c._id));
  const connectionList = ignoreUnusedConnections ? usedConnections : [...usedConnections, ...unUsedConnections];

  return {
    connections: connectionList,
    flows,
    exports,
    imports,
  };
}

export function getIAFlowSettings(integration, flowId, childId) {
  const allFlows = [];

  // TODO: InstallSteps check here is temporary. Nees to to change this as part of IA2.o implementation.
  if (
    !integration ||
    !integration._connectorId ||
    (integration.installSteps && integration.installSteps.length)
  ) {
    if (integration?._connectorId) {
      return defaultIA2Flow;
    }

    return emptyObject;
  }

  if (integration.settings && integration.settings.supportsMultiStore) {
    if (childId) {
      const section = integration.settings.sections.find(sec => sec.id === childId);

      if (!section || !section.sections) {
        return emptyObject;
      }

      const { flows } = section.sections.reduce((a, b) => ({
        flows: [...a.flows, ...b.flows],
      }));

      allFlows.push(...(flows || []));
    } else {
      integration.settings.sections.forEach(section => {
        if (!section.sections) {
          return emptyObject;
        }

        const { flows } = section.sections.reduce((a, b) => ({
          flows: [...a.flows, ...b.flows],
        }));

        allFlows.push(...(flows || []));
      });
    }
  } else {
    const { flows } = integration.settings.sections.reduce((a, b) => ({
      flows: [...a.flows, ...b.flows],
    }));

    allFlows.push(...(flows || []));
  }

  return allFlows.find(flow => flow._id === flowId) || emptyObject;
}

export function getFlowResources(flows = [], exports = [], imports = [], flowId) {
  const resources = [];
  const flow = (flows || []).find(f => f._id === flowId);

  resources.push({ _id: flowId, name: 'Flow-level' });

  if (!flow) {
    return resources;
  }

  if (flow._exportId) {
    const exportDoc = exports.find(e => e._id === flow._exportId);

    if (exportDoc) {
      resources.push({ _id: flow._exportId, name: exportDoc.name || flow._exportId, type: 'exports' });
    }
  }

  if (flow._importId) {
    const importDoc = imports.find(e => e._id === flow._importId);

    if (importDoc) {
      resources.push({ _id: flow._importId, name: importDoc.name || flow._importId, type: 'imports' });
    }
  }

  if (flow.pageGenerators && flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      const exportDoc = exports.find(e => e._id === pg._exportId);

      if (exportDoc) {
        resources.push({ _id: pg._exportId, name: exportDoc.name || pg._exportId, type: 'exports' });
      }
    });
  }
  const pageProcessors = getAllPageProcessors(flow);

  if (pageProcessors.length) {
    pageProcessors.forEach(pp => {
      if (pp.type === 'import' && pp._importId) {
        const importDoc = imports.find(e => e._id === pp._importId);

        if (importDoc) {
          resources.push({ _id: pp._importId, name: importDoc.name || pp._importId, type: 'imports' });
        }
      } else if (pp.type === 'export' && pp._exportId) {
        const exportDoc = exports.find(e => e._id === pp._exportId);

        if (exportDoc) {
          resources.push({ _id: pp._exportId, name: exportDoc.name || pp._exportId, type: 'exports', isLookup: true });
        }
      }
    });
  }

  return resources;
}

// TODO: The object returned from this selector needs to be overhauled.
// It is shared between IA and DIY flows,
// yet its impossible to know which works for each flow type. For example,
// showMapping is an IA only field, how do we determine if a DIY flow has mapping support?
// Maybe its best to only hav common props here and remove all IA props to a separate selector.
export function getFlowDetails(flow, integration, exports, childId) {
  if (!flow) return emptyObject;

  return produce(flow, draft => {
    draft.isRealtime = isRealtimeFlow(flow, exports);
    draft.isSimpleImport = isSimpleImportFlow(flow, exports);
    draft.isRunnable = isRunnable(flow, exports);
    draft.canSchedule = showScheduleIcon(flow, exports);
    draft.isDeltaFlow = isDeltaFlow(flow, exports);
    draft.isSetupInProgress = isSetupInProgress(flow);
    const flowSettings = getIAFlowSettings(integration, flow._id, childId);

    draft.showMapping = !!flowSettings.showMapping;
    draft.hasSettings = !!(
      (flowSettings.settings && flowSettings.settings.length) ||
      (flowSettings.sections && flowSettings.sections.length)
    );
    draft.showSchedule = flow._connectorId
      ? draft.canSchedule && !!flowSettings.showSchedule
      : draft.canSchedule;
    draft.showStartDateDialog = !!flowSettings.showStartDateDialog;
    draft.disableSlider = !!flowSettings.disableSlider;
    draft.disableRunFlow = !!flowSettings.disableRunFlow;
    draft.showUtilityMapping = !!flowSettings.showUtilityMapping;
  });
}

export function getFlowReferencesForResource(
  flows,
  exports,
  imports,
  resourceType,
  resourceId
) {
  const existingFlows = keys(flows);
  const flowRefs = [];

  existingFlows.forEach(flowId => {
    const { pageGenerators = [] } = flows[flowId];
    const pageProcessors = getAllPageProcessors(flows[flowId]);
    let [pgIndex, ppIndex] = [0, 0];

    while (pgIndex < pageGenerators.length) {
      const pg = pageGenerators[pgIndex];
      const pgResource = exports.find(e => e._id === pg._exportId);

      if (
        isValidResourceReference(
          pgResource,
          pg._exportId,
          resourceType,
          resourceId
        )
      ) {
        flowRefs.push({ flowId, resourceId: pg._exportId });

        return;
      }

      pgIndex += 1;
    }

    while (ppIndex < pageProcessors.length) {
      const pp = pageProcessors[ppIndex];
      const ppId = pp._exportId || pp._importId;
      const ppResourceType = pp._exportId ? 'exports' : 'imports';
      let ppResource;

      if (ppResourceType === 'exports') {
        ppResource = exports.find(e => e._id === ppId);
      } else {
        ppResource = imports.find(i => i._id === ppId);
      }

      if (
        isValidResourceReference(ppResource, ppId, resourceType, resourceId)
      ) {
        flowRefs.push({ flowId, resourceId: ppId });

        return;
      }

      ppIndex += 1;
    }
  });

  return flowRefs;
}

export function populateRestSchema(exportDoc = {}) {
  const {
    http = {},
    adaptorType,
    rest = {},
    assistant,
  } = exportDoc;

  if (adaptorType === 'RESTExport') {
    // eslint-disable-next-line no-param-reassign
    exportDoc._rest = deepClone(exportDoc.rest);

    return exportDoc;
  }

  if (assistant || !http.method || http.formType !== 'rest' || adaptorType !== 'HTTPExport') {
    return exportDoc;
  }
  const restSubDoc = {...rest};

  try {
    restSubDoc.relativeURI = http.relativeURI;
    if (!http.paging) {
      http.paging = {};
    }

    if (http.paging.method || http.paging.maxPagePath || http.paging.maxCountPath || http.paging.lastPageStatusCode ||
    http.paging.lastPagePath || http.paging.lastPageValues || http.paging.relativeURI || http.paging.page || http.paging.urlPath) {
      if (http.paging.maxPagePath) { restSubDoc.maxPagePath = http.paging.maxPagePath; }
      if (http.paging.maxCountPath) { restSubDoc.maxCountPath = http.paging.maxCountPath; }

      restSubDoc.lastPageStatusCode = http.paging.lastPageStatusCode;
      if (http.paging.lastPagePath) { restSubDoc.lastPagePath = http.paging.lastPagePath; }
      if (http.paging.path) { restSubDoc.nextPagePath = http.paging.path; }
      if (Array.isArray(http.paging.lastPageValues)) {
        [restSubDoc.lastPageValue] = http.paging.lastPageValues;
      }

      const pagingMethodMap = {
        url: 'nextpageurl',
        page: 'pageargument',
        relativeuri: 'relativeuri',
        linkheader: 'linkheader',
        skip: 'skipargument',
        token: 'token',
        body: 'postbody',
      };

      restSubDoc.pagingMethod = pagingMethodMap[http.paging.method];

      if (restSubDoc.pagingMethod === 'relativeuri') {
        restSubDoc.nextPageRelativeURI = http.paging.relativeURI;
      } else if (restSubDoc.pagingMethod === 'token') {
        const uriObj = url.parse(http.paging.relativeURI, true);

        uriObj.search = null;
        const paramValues = invert(uriObj.query);
        const pageArgument = paramValues['{{export.http.paging.token}}'] || paramValues['{{{export.http.paging.token}}}'];

        if (pageArgument) {
          restSubDoc.pageArgument = pageArgument;
        }
      } else if (restSubDoc.pagingMethod === 'skipargument') {
        if (http.relativeURI) {
          const path = http.relativeURI.split('?')[0];
          const uriObj = url.parse(http.paging.relativeURI, true);

          uriObj.search = null;
          const paramValues = invert(uriObj.query);
          const skipArgument = paramValues['{{export.http.paging.skip}}'] || paramValues['{{{export.http.paging.skip}}}'];

          if (skipArgument) {
            restSubDoc.skipArgument = skipArgument;
            uriObj.query[restSubDoc.skipArgument] = http.paging.skip;
            restSubDoc.relativeURI = `${path}?${qs.stringify(uriObj.query, { encode: false })}`;
          } else {
            const skipArgRegex = /\{\{#compare export.http.paging.skip.*\}\}(&|\?)(.*)=\{{2,3}export.http.paging.skip\}{2,3}\{\{\/compare\}\}/;
            const path = http.relativeURI.replace(skipArgRegex, '');

            if (skipArgRegex.test(http.relativeURI)) {
              [,, restSubDoc.skipArgument] = skipArgRegex.exec(http.relativeURI);
            }
            restSubDoc.relativeURI = path;
          }
        }
      } else if (restSubDoc.pagingMethod === 'pageargument') {
        if (http.relativeURI) {
          const uriObj = url.parse(http.paging.relativeURI, true);
          const path = http.relativeURI.split('?')[0];

          uriObj.search = null;
          const paramValues = invert(uriObj.query);
          const pageArgument = paramValues['{{export.http.paging.page}}'] || paramValues['{{{export.http.paging.page}}}'];

          if (pageArgument) {
            restSubDoc.pageArgument = pageArgument;
            uriObj.query[restSubDoc.pageArgument] = http.paging.page;
            restSubDoc.relativeURI = `${path}?${qs.stringify(uriObj.query, { encode: false })}`;
          } else {
            const pagingArgRegex = /\{\{#compare export.http.paging.page.*\}\}(&|\?)(.*)=\{{2,3}export.http.paging.page\}{2,3}\{\{\/compare\}\}/;
            const path = http.relativeURI.replace(pagingArgRegex, '');

            if (pagingArgRegex.test(http.relativeURI)) {
              [,, restSubDoc.pageArgument] = pagingArgRegex.exec(http.relativeURI);
            }
            restSubDoc.relativeURI = path;
          }
        }
      } else if (restSubDoc.pagingMethod === 'linkheader' && http.paging.linkHeaderRelation) {
        restSubDoc.linkHeaderRelation = http.paging.linkHeaderRelation;
      } else if (restSubDoc.pagingMethod === 'postbody') {
        restSubDoc.pagingPostBody = http.paging.body;
      }
    }

    // eslint-disable-next-line no-param-reassign
    exportDoc._rest = restSubDoc;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('exception occured while forming REST document', e);
    // TODO: should we change formType to http when conversion fails, so the export can open in HTTP form?
  }

  return exportDoc;
}

export function convertOldFlowSchemaToNewOne(flow) {
  const {
    pageGenerators,
    pageProcessors,
    _exportId,
    _importId,
    ...rest
  } = flow;

  // a new schema just return the flow unaltered
  if (!isOldFlowSchema(flow)) {
    return flow;
  }

  const updatedFlow = {
    ...rest,
    pageGenerators,
    pageProcessors,
    // set this flag when converting it to new schema
    flowConvertedToNewSchema: true,
  };

  // Supports Old Flows with _exportId and _importId converted to __pageGenerators and _pageProcessors
  if (!pageGenerators && _exportId) {
    updatedFlow.pageGenerators = [
      {
        type: 'export',
        _exportId,
      },
    ];
  }

  if (!pageProcessors && _importId) {
    updatedFlow.pageProcessors = [
      {
        type: 'import',
        _importId,
      },
    ];
  }

  return updatedFlow;
}

export const isFlowUpdatedWithPgOrPP = (flow, resourceId) => {
  if (!flow) return false;

  return !!(flow.pageGenerators?.some(pg => pg._exportId === resourceId) ||
  flow.pageProcessors?.some(pp => pp._exportId === resourceId || pp._importId === resourceId) ||
  flow.routers?.some(router => router.branches.some(branch => branch.pageProcessors?.some(pp => pp._exportId === resourceId || pp._importId === resourceId))));
};

export function getScriptsReferencedInFlow(
  {
    flow = {},
    exports = [],
    imports = [],
    scripts = [],
  }
) {
  const scriptIdsUsed = [];
  const checkForHookScripts = hooks => {
    if (!hooks) {
      return;
    }
    Object.keys(hooks).forEach(hookName => {
      if (HOOKS_IN_IMPORT_EXPORT_RESOURCE.includes(hookName)) {
        if (hooks[hookName]?._scriptId && scriptIdsUsed.indexOf(hooks[hookName]._scriptId) === -1) {
          scriptIdsUsed.push(hooks[hookName]._scriptId);
        }
      }
    });
  };

  if (!flow) return emptyList;
  flow.routers?.forEach(router => {
    if (router.routeRecordsUsing === 'script' && router.script?._scriptId) {
      scriptIdsUsed.push(router.script._scriptId);
    }
  });
  const _exports = flow._exportId ? [flow._exportId] : map(flow.pageGenerators, '_exportId');

  _exports.forEach(_exportId => {
    const _export = exports?.find(({_id}) => _id === _exportId);

    if (_export) {
      if (_export.filter?.type === 'script' && _export?.filter?.script?._scriptId) {
        scriptIdsUsed.push(_export.filter.script._scriptId);
      }
      if (_export.inputFilter?.type === 'script' && _export?.inputFilter?.script?._scriptId) {
        scriptIdsUsed.push(_export.inputFilter.script._scriptId);
      }
      if (_export.responseTransform?.type === 'script' && _export?.responseTransform?.script?._scriptId) {
        scriptIdsUsed.push(_export.responseTransform.script._scriptId);
      }
      if (_export.transform?.type === 'script' && _export?.transform?.script?._scriptId) {
        scriptIdsUsed.push(_export.transform.script._scriptId);
      }
      checkForHookScripts(_export.hooks);
    }
  });

  const pageProcessors = flow._importId ? [{type: 'import', _importId: flow._importId}] : getAllPageProcessors(flow);

  pageProcessors.forEach(({hooks, type, _importId, _exportId}) => {
    if (hooks?.postResponseMap?._scriptId && scriptIdsUsed.indexOf(hooks.postResponseMap._scriptId) === -1) {
      scriptIdsUsed.push(hooks.postResponseMap._scriptId);
    }

    if (type === 'import') {
      const _import = imports?.find(({_id}) => _id === _importId);

      if (_import) {
        // todo: check if we need to check for filter.type ==='script'?
        if (_import.filter?.type === 'script' && _import.filter?.script?._scriptId) {
          scriptIdsUsed.push(_import.filter.script._scriptId);
        }
        if (_import.responseTransform?.type === 'script' && _import.responseTransform?.script?._scriptId) {
          scriptIdsUsed.push(_import.responseTransform.script._scriptId);
        }
        checkForHookScripts(_import.hooks);
      }
    } else if (type === 'export') {
      const _export = exports.find(({_id}) => _id === _exportId);

      if (_export) {
        if (_export.filter?.type === 'script' && _export.filter?.script?._scriptId) {
          scriptIdsUsed.push(_export.filter.script._scriptId);
        }
        if (_export.inputFilter?.type === 'script' && _export.inputFilter?.script?._scriptId) {
          scriptIdsUsed.push(_export.inputFilter.script._scriptId);
        }
        if (_export.responseTransform?.type === 'script' && _export.responseTransform?.script?._scriptId) {
          scriptIdsUsed.push(_export.responseTransform.script._scriptId);
        }
        if (_export.transform?.type === 'script' && _export.transform?.script?._scriptId) {
          scriptIdsUsed.push(_export.transform.script._scriptId);
        }
        checkForHookScripts(_export.hooks);
      }
    }
  });

  const filtered = scripts.filter(({_id}) => scriptIdsUsed.includes(_id));

  return filtered;
}

// this util adds properties to make the the flow lastExecutedAt sortable
export function addLastExecutedAtSortableProp({
  flows,
  isUserInErrMgtTwoDotZero,
  latestFlowJobs,
  supportsMultiStore,
  childId,
  requiredFlows }) {
  const jobStatusPriorityMap = {
    // large dates
    [JOB_STATUS.QUEUED]: '2300-06-17T16:51:35.209Z',
    [JOB_STATUS.RETRYING]: '2300-05-17T16:51:35.209Z',
    [JOB_STATUS.RUNNING]: '2300-04-17T16:51:35.209Z',
  };

  const updatedFlows = flows?.map((flow, i) => {
    const toReturnFlow = (supportsMultiStore && !childId) ? ({...flow, ...requiredFlows[i]}) : flow;

    const {_id: flowId} = toReturnFlow;
    const job = latestFlowJobs?.find(job => job._flowId === flowId);

    if (!job || !isUserInErrMgtTwoDotZero) {
      return {...toReturnFlow, lastExecutedAtSort: toReturnFlow.lastExecutedAt, lastExecutedAtSortType: 'date' };
    }

    if ([JOB_STATUS.COMPLETED, JOB_STATUS.CANCELED, JOB_STATUS.FAILED].includes(job.status)) {
      return {...toReturnFlow, lastExecutedAtSort: job.lastExecutedAt, lastExecutedAtSortType: 'date' };
    }

    // queued running retrying are the other statuses
    const isJobInQueuedStatus =
    (job.status === JOB_STATUS.QUEUED ||
      (job.status === JOB_STATUS.RUNNING && !job.doneExporting));

    return {
      ...toReturnFlow,
      lastExecutedAtSort: jobStatusPriorityMap[job.status],
      lastExecutedAtSortJobStatus: JOB_UI_STATUS[job.status],
      isJobInQueuedStatus,
      lastExecutedAtSortType: 'status'};
  });

  return updatedFlows;
}

// this function determines if we need to update the last modified time of a flow
export function shouldUpdateLastModified(flow, resource) {
  return flow?.lastModified && resource?.lastModified && flow.lastModified < resource.lastModified;
}

// this function returns a patch used to 'patch and commit' the flow last modified time
export function flowLastModifiedPatch(flow, resource) {
  if (!shouldUpdateLastModified(flow, resource)) return [];

  return [{
    op: 'replace',
    path: '/lastModified',
    value: resource.lastModified,
  }];
}

// when there are flowGroupings and there are uncategorized flows do you have a UnassignedSection
export const shouldHaveUnassignedSection = (flowGroupingsSections, flows) => !!(flowGroupingsSections && flows?.some(flow => !flow._flowGroupingId));
export const getFlowGroup = (flowGroupings, name, id) => {
  if (!flowGroupings?.length) return null;

  const unassignedFlowGroup = {
    _id: UNASSIGNED_SECTION_ID,
    name: UNASSIGNED_SECTION_NAME,
  };
  const requiredFlowGroup = flowGroupings.find(flowGroup => flowGroup.name === name || flowGroup._id === id);

  return requiredFlowGroup || unassignedFlowGroup;
};

// for every flowGroup pushing the linked flows into finalObject
// adding isLastFlowInFlowGroup flag for every last flow in the flow group
export const mappingFlowsToFlowGroupings = (flowGroupings, flowObjects = [], objectsLength) => {
  if (!flowGroupings?.length) {
    return flowObjects;
  }

  const shouldHaveUnassignedSection = flowObjects.some(flowObject => !flowObject.doc?._flowGroupingId);
  const allFlowGroupings = shouldHaveUnassignedSection ? [...flowGroupings, {
    name: UNASSIGNED_SECTION_NAME,
    _id: UNASSIGNED_SECTION_ID,
  }] : flowGroupings;

  const finalFlowObjects = allFlowGroupings.map(({_id: groupId, name}, index) => {
    const flowGroupObject = {
      groupName: name,
      _id: index + objectsLength,
    };
    const flowObjetsOfAFlowGroup = flowObjects.filter(flowObject =>
      (name === UNASSIGNED_SECTION_NAME && !flowObject.doc?._flowGroupingId) || flowObject.doc?._flowGroupingId === groupId);

    if (!flowObjetsOfAFlowGroup.length) {
      return [flowGroupObject, { emptyMessage: 'No flows have been added to this group.' }];
    }

    flowObjetsOfAFlowGroup[flowObjetsOfAFlowGroup.length - 1] = { ...flowObjetsOfAFlowGroup[flowObjetsOfAFlowGroup.length - 1], isLastFlowInFlowGroup: true};

    return [flowGroupObject, ...flowObjetsOfAFlowGroup];
  }).flat();

  return finalFlowObjects;
};

export const getPageProcessorFromFlow = (flow, pageProcessorId) => {
  const pageProcessors = getAllPageProcessors(flow);

  return pageProcessors.find(({_importId, _exportId}) => _exportId === pageProcessorId || _importId === pageProcessorId);
};
