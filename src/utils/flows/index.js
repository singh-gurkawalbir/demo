import produce from 'immer';
import { keys, map, uniq } from 'lodash';
import mappingUtil from '../mapping';
import {
  adaptorTypeMap,
  isBlobTypeResource,
  isValidResourceReference,
  isFileAdaptor,
} from '../resource';
import { emptyList, emptyObject, STANDALONE_INTEGRATION } from '../constants';
import getRoutePath from '../routePaths';

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
  const { adaptorType, rdbms = {}, file = {} } = importResource;
  const appType = adaptorTypeMap[adaptorType];

  // For File Adaptor XML Imports, no support for import mapping
  if (isFileAdaptor(importResource) && file.type === 'xml') return false;
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

  // AS2 Exports are real-time.
  if (exp.adaptorType === 'AS2Export') return true;

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

export function flowbuilderUrl(flowId, integrationId, { childId, isIntegrationApp, isDataLoader, appName}) {
  const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

  let flowBuilderTo;

  if (isIntegrationApp) {
    if (childId) {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${childId}/${flowBuilderPathName}/${flowId}`);
    } else {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`);
    }
  } else {
    flowBuilderTo = getRoutePath(`/integrations/${integrationId || 'none'}/${flowBuilderPathName}/${flowId}`);
  }

  return flowBuilderTo;
}

export function showScheduleIcon(flow, exports, flowExports) {
  if (isSimpleImportFlow(flow, exports, flowExports)) return false;

  return hasBatchExport(flow, exports, flowExports);
}

export function flowAllowsScheduling(flow, integration, allExports, isAppVersion2, flowExports) {
  if (!flow) return false;
  const isApp = flow._connectorId;
  const canSchedule = showScheduleIcon(flow, allExports, flowExports);

  // For IA2.0, 'showSchedule' is assumed true for now until we have more clarity
  if (!isApp || isAppVersion2) return canSchedule;
  // eslint-disable-next-line no-use-before-define
  const flowSettings = getIAFlowSettings(integration, flow._id);

  return canSchedule && !!flowSettings.showSchedule;
}

export function getFlowType(flow, exports, flowExports) {
  if (!flow) return '';
  if (!exports && !flowExports) return '';
  if (isSimpleImportFlow(flow, exports, flowExports)) return 'Data Loader';
  if (isRealtimeFlow(flow, exports, flowExports)) return 'Realtime';

  // TODO: further refine this logic to differentiate between 'Scheduled'
  // and 'mixed'. Note that mixed is the case where some exports are scheduled
  // and others are not.
  return 'Scheduled';
}

export function flowSupportsSettings(flow, integration) {
  if (!flow) return false;
  const isApp = flow._connectorId;

  if (!isApp) return false;
  // eslint-disable-next-line no-use-before-define
  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!(
    (flowSettings.settings && flowSettings.settings.length) ||
    (flowSettings.sections && flowSettings.sections.length)
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
  if (!hasBatchExport(flow, exports)) {
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
  }

  if (!importIds.length) return emptyList;

  return imports.filter(i => importIds.indexOf(i._id) > -1);
}

export function getPageProcessorImportsFromFlow(imports, pageProcessors) {
  let ppImports = [];
  const pageProcessorIds = [];

  if (!pageProcessors) {
    return imports;
  }

  pageProcessors.forEach(pageProcessor => {
    if (pageProcessor && pageProcessor._importId) {
      pageProcessorIds.push(pageProcessor._importId);
    }
  });
  ppImports =
    imports && imports.filter(i => pageProcessorIds.indexOf(i._id) > -1);

  return ppImports;
}

export function getFlowListWithMetadata(flows = [], exports = []) {
  // TODO are we not mutating state here in getter and should we not return a clone.
  flows.forEach((f, i) => {
    if (isRealtimeFlow(f, exports)) {
      /* eslint-disable no-param-reassign */
      flows[i].isRealtime = true;
    }

    if (isSimpleImportFlow(f, exports)) {
      flows[i].isSimpleImport = true;
    }

    if (isRunnable(f, exports)) {
      flows[i].isRunnable = true;
    }

    if (showScheduleIcon(f, exports)) {
      flows[i].showScheduleIcon = true;
    }
  });

  return { resources: flows };
}

export function getNextDataFlows(flows, flow) {
  const { _integrationId } = flow;
  // Incase of standalone Integrations, _integrationId is undefined for flow resources
  const flowIntegrationId =
    _integrationId === STANDALONE_INTEGRATION ? undefined : _integrationId;

  // Returns all valid flows under this integration
  return flows.filter(
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
  const { integrationId, storeId, ignoreUnusedConnections } = options;
  const integrationConnections = allConnections.filter(c => c._integrationId === integrationId);
  const integrationFlows = allFlows.filter(f => f._integrationId === integrationId);

  if (!supportsMultiStore || !storeId) {
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
  const selectedStore = (sections || []).find(s => s.id === storeId) || {};

  (selectedStore.sections || []).forEach(sec => {
    flowIds.push(...map(sec.flows, '_id'));
  });
  (sections || []).forEach(store => {
    (store.sections || []).forEach(sec => {
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

export function getIAFlowSettings(integration, flowId) {
  const allFlows = [];

  // TODO: InstallSteps check here is temporary. Nees to to change this as part of IA2.o implementation.
  if (
    !integration ||
    !integration._connectorId ||
    (integration.installSteps && integration.installSteps.length)
  ) {
    // return empty object for DIY integrations.
    return emptyObject;
  }

  if (integration.settings && integration.settings.supportsMultiStore) {
    integration.settings.sections.forEach(section => {
      if (!section.sections) {
        return;
      }

      const { flows } = section.sections.reduce((a, b) => ({
        flows: [...a.flows, ...b.flows],
      }));

      allFlows.push(...(flows || []));
    });
  } else {
    const { flows } = integration.settings.sections.reduce((a, b) => ({
      flows: [...a.flows, ...b.flows],
    }));

    allFlows.push(...(flows || []));
  }

  return allFlows.find(flow => flow._id === flowId) || emptyObject;
}

export function getFlowResources(flows, exports, imports, flowId) {
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

  if (flow.pageProcessors && flow.pageProcessors.length) {
    flow.pageProcessors.forEach(pp => {
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
export function getFlowDetails(flow, integration, exports) {
  if (!flow) return emptyObject;

  return produce(flow, draft => {
    draft.isRealtime = isRealtimeFlow(flow, exports);
    draft.isSimpleImport = isSimpleImportFlow(flow, exports);
    draft.isRunnable = isRunnable(flow, exports);
    draft.canSchedule = showScheduleIcon(flow, exports);
    draft.isDeltaFlow = isDeltaFlow(flow, exports);
    const flowSettings = getIAFlowSettings(integration, flow._id);

    draft.showMapping = flowSettings.showMapping;
    draft.hasSettings = !!(
      (flowSettings.settings && flowSettings.settings.length) ||
      (flowSettings.sections && flowSettings.sections.length)
    );
    draft.showSchedule = flow._connectorId
      ? draft.canSchedule && !!flowSettings.showSchedule
      : draft.canSchedule;
    draft.showStartDateDialog = flowSettings.showStartDateDialog;
    draft.disableSlider = flowSettings.disableSlider;
    draft.disableRunFlow = !!flowSettings.disableRunFlow;
    draft.showUtilityMapping = flowSettings.showUtilityMapping;
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
    const { pageGenerators = [], pageProcessors = [] } = flows[flowId];
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

export const isFlowUpdatedWithPgOrPP = (flow, resourceId) => !!(flow && (
  (flow.pageGenerators &&
     flow.pageGenerators.some(({_exportId}) => _exportId === resourceId)) ||
    (
      flow.pageProcessors &&
    flow.pageProcessors.some(({_exportId, _importId}) => _exportId === resourceId || _importId === resourceId))));
