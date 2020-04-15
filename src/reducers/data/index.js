import { combineReducers } from 'redux';
import { uniq } from 'lodash';
import resources, * as fromResources from './resources';
import integrationAShares, * as fromIntegrationAShares from './integrationAShares';
import integrationApps, * as fromIntegrationApps from './integrationApps';
import audit, * as fromAudit from './audit';
import jobs, * as fromJobs from './jobs';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../constants/resource';
import suiteScript, * as fromSuiteScript from './suiteScript';
import marketplace, * as fromMarketplace from './marketPlace';
import fileDefinitions, * as fromFileDefinitions from './fileDefinitions';

export default combineReducers({
  resources,
  integrationAShares,
  integrationApps,
  audit,
  jobs,
  suiteScript,
  marketplace,
  fileDefinitions,
});

// #region resource selectors
export function resource(state, resourceType, id) {
  return fromResources.resource(state && state.resources, resourceType, id);
}

export function resourceList(state, options) {
  return fromResources.resourceList(state && state.resources, options);
}

export function resourceDetailsMap(state, options) {
  return fromResources.resourceDetailsMap(state && state.resources, options);
}

// #region integration resource selectors
export function integrationInstallSteps(state, id) {
  return fromResources.integrationInstallSteps(state && state.resources, id);
}

export function integrationAppSettings(state, id) {
  return fromResources.integrationAppSettings(state && state.resources, id);
}

export function defaultStoreId(state, id, store) {
  return fromResources.defaultStoreId(state && state.resources, id, store);
}

// #region integration Apps
export function categoryRelationshipData(state, integrationId, flowId) {
  return fromIntegrationApps.categoryRelationshipData(
    state && state.integrationApps,
    integrationId,
    flowId
  );
}

// #endregion
export function processors(state) {
  return fromResources.processors(state && state.resources);
}

export function hasData(state, resourceType) {
  return fromResources.hasData(state && state.resources, resourceType);
}

export function isAgentOnline(state, agentId) {
  return fromResources.isAgentOnline(state && state.resources, agentId);
}

export function exportNeedsRouting(state, id) {
  return fromResources.exportNeedsRouting(state && state.resources, id);
}

export function connectionHasAs2Routing(state, id) {
  return fromResources.connectionHasAs2Routing(state && state.resources, id);
}
// #endregion

export function integrationUsers(state, integrationId) {
  return fromIntegrationAShares.integrationUsers(
    state && state.integrationAShares,
    integrationId
  );
}

export function auditLogs(state, resourceType, resourceId, filters) {
  const allResources = fromResources.resourceDetailsMap(state.resources);
  const logs = fromAudit.auditLogs(
    state.audit,
    resourceType,
    resourceId,
    filters
  );
  let resourceDetails;
  let resourceTypePlural;
  const filteredLogs = logs.filter(log => {
    resourceTypePlural = RESOURCE_TYPE_SINGULAR_TO_PLURAL[log.resourceType];

    if (
      !allResources[resourceTypePlural] ||
      !allResources[resourceTypePlural][log._resourceId]
    ) {
      return true;
    }

    resourceDetails = allResources[resourceTypePlural][log._resourceId];

    if (resourceDetails && resourceDetails._connectorId) {
      if (
        ['integrations', 'flows', 'connections'].includes(resourceTypePlural)
      ) {
        return true;
      }

      if (log.fieldChanges && log.fieldChanges.length) {
        // eslint-disable-next-line no-param-reassign
        log.fieldChanges = log.fieldChanges.filter(
          fc =>
            fc.fieldPath &&
            (fc.fieldPath.includes('mapping') ||
              fc.fieldPath.includes('lookups'))
        );

        return log.fieldChanges.length > 0;
      }

      return false;
    }

    return true;
  });
  const expandedLogs = [];

  filteredLogs.forEach(a => {
    if (a.fieldChanges && a.fieldChanges.length > 0) {
      a.fieldChanges.forEach((fc, index) => {
        expandedLogs.push({
          ...a,
          _id: `${a._id}-${index}` /* CeligoTable is using _id as key for TableRow hence making it unique. This is a safe change for now as we are not supporting any of create, edit or delete operations on audit logs. */,
          fieldChanges: undefined,
          fieldChange: fc,
        });
      });
    } else {
      expandedLogs.push({ ...a, fieldChange: {} });
    }
  });

  return expandedLogs;
}

export function affectedResourcesAndUsersFromAuditLogs(
  state,
  resourceType,
  resourceId
) {
  const logs = auditLogs(state, resourceType, resourceId);
  const affectedResources = {};

  logs.forEach(a => {
    if (!affectedResources[a.resourceType]) {
      affectedResources[a.resourceType] = [];
    }

    affectedResources[a.resourceType].push(a._resourceId);
  });

  Object.keys(affectedResources).forEach(resourceType => {
    affectedResources[resourceType] = uniq(affectedResources[resourceType]);
  });

  const users = {};

  logs.forEach(a => {
    users[a.byUser._id] = a.byUser;
  });

  return {
    affectedResources,
    users: Object.keys(users).map(id => users[id]),
  };
}

export function suiteScriptTiles(state, connectionId) {
  return fromSuiteScript.tiles(state.suiteScript, connectionId);
}

export function suiteScriptIntegrations(state, connectionId) {
  return fromSuiteScript.integrations(state.suiteScript, connectionId);
}

export function marketplaceConnectors(state, application, sandbox, licenses) {
  return fromMarketplace.connectors(
    state && state.marketplace,
    application,
    sandbox,
    licenses
  );
}

export function integrationAppList(state) {
  return fromMarketplace.integrationAppList(state && state.marketplace);
}

export function marketplaceTemplates(state, application) {
  return fromMarketplace.templates(state && state.marketplace, application);
}

export function template(state, templateId) {
  return fromMarketplace.template(state && state.marketplace, templateId);
}

export function flowJobsPagingDetails(state) {
  return fromJobs.flowJobsPagingDetails(state.jobs);
}

export function flowJobs(state) {
  return fromJobs.flowJobs(state.jobs);
}

export function inProgressJobIds(state) {
  return fromJobs.inProgressJobIds(state.jobs);
}

export function job(state, { type, jobId, parentJobId }) {
  return fromJobs.job(state.jobs, {
    type,
    jobId,
    parentJobId,
  });
}

export function isBulkRetryInProgress(state) {
  return fromJobs.isBulkRetryInProgress(state.jobs);
}

export function jobErrors(state, jobId) {
  return fromJobs.jobErrors(state.jobs, jobId);
}

export function jobErrorRetryObject(state, retryId) {
  return fromJobs.jobErrorRetryObject(state.jobs, retryId);
}

export const getPreBuiltFileDefinitions = (state, format) =>
  fromFileDefinitions.getPreBuiltFileDefinitions(
    state && state.fileDefinitions,
    format
  );

export const getFileDefinition = (state, definitionId, options) =>
  fromFileDefinitions.getFileDefinition(
    state && state.fileDefinitions,
    definitionId,
    options
  );

export const hasSuiteScriptData = (
  state,
  { ssLinkedConnectionId, integrationId, resourceType }
) =>
  fromSuiteScript.hasData(state && state.suiteScript, {
    ssLinkedConnectionId,
    integrationId,
    resourceType,
  });

export const suiteScriptResource = (
  state,
  { resourceType, id, ssLinkedConnectionId, integrationId, flowType }
) =>
  fromSuiteScript.resource(state && state.suiteScript, {
    resourceType,
    id,
    ssLinkedConnectionId,
    integrationId,
    flowType,
  });

export const suiteScriptResourceList = (
  state,
  { resourceType, ssLinkedConnectionId, integrationId }
) =>
  fromSuiteScript.resourceList(state && state.suiteScript, {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  });
