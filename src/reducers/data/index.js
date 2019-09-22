import { combineReducers } from 'redux';
import { uniq } from 'lodash';
import resources, * as fromResources from './resources';
import integrationAShares, * as fromIntegrationAShares from './integrationAShares';
import audit, * as fromAudit from './audit';
import accessTokens, * as fromAccessTokens from './accessTokens';
import jobs, * as fromJobs from './jobs';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../constants/resource';
import suiteScript, * as fromSuiteScript from './suiteScript';
import marketplace, * as fromMarketPlace from './marketPlace';

export default combineReducers({
  resources,
  integrationAShares,
  audit,
  accessTokens,
  jobs,
  suiteScript,
  marketplace,
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

export function processors(state) {
  return fromResources.processors(state && state.resources);
}

export function hasData(state, resourceType) {
  return fromResources.hasData(state && state.resources, resourceType);
}

export function isAgentOnline(state, agentId) {
  return fromResources.isAgentOnline(state && state.resources, agentId);
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
      a.fieldChanges.forEach(fc => {
        expandedLogs.push({ ...a, fieldChanges: undefined, fieldChange: fc });
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

export function accessTokenList(state, integrationId) {
  return fromAccessTokens.accessTokenList(state.accessTokens, integrationId);
}

export function accessToken(state, id) {
  return fromAccessTokens.accessToken(state.accessTokens, id);
}

export function suiteScriptTiles(state, connectionId) {
  return fromSuiteScript.tiles(state.suiteScript, connectionId);
}

export function suiteScriptIntegrations(state, connectionId) {
  return fromSuiteScript.integrations(state.suiteScript, connectionId);
}

export function marketplaceConnectors(state, application, sandbox, licenses) {
  return fromMarketPlace.connectors(
    state.marketplace,
    application,
    sandbox,
    licenses
  );
}

export function marketplaceTemplates(state, application) {
  return fromMarketPlace.templates(state.marketplace, application);
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
  return fromJobs.job(state.jobs, { type, jobId, parentJobId });
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
