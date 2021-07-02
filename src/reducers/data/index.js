import { combineReducers } from 'redux';
import { uniq } from 'lodash';
import resources, { selectors as fromResources } from './resources';
import integrationAShares, { selectors as fromIntegrationAShares } from './integrationAShares';
import integrationApps, { selectors as fromIntegrationApps } from './integrationApps';
import audit, { selectors as fromAudit } from './audit';
import jobs, { selectors as fromJobs } from './jobs';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../constants/resource';
import suiteScript, { selectors as fromSuiteScript } from './suiteScript';
import marketplace, { selectors as fromMarketplace } from './marketPlace';
import fileDefinitions, { selectors as fromFileDefinitions } from './fileDefinitions';
import { genSelectors } from '../util';
import runningJobs, { selectors as fromRunningJobs } from './jobs/runningJobs';

export default combineReducers({
  resources,
  integrationAShares,
  integrationApps,
  audit,
  jobs,
  suiteScript,
  marketplace,
  fileDefinitions,
  runningJobs,
});

export const selectors = {};
const subSelectors = {
  resources: fromResources,
  integrationApps: fromIntegrationApps,
  suiteScript: fromSuiteScript,
  marketplace: fromMarketplace,
  integrationAShares: fromIntegrationAShares,
  audit: fromAudit,
  jobs: fromJobs,
  runningJobs: fromRunningJobs,
  fileDefinitions: fromFileDefinitions,
};

genSelectors(selectors, subSelectors);

selectors.auditLogs = (state, resourceType, resourceId, filters) => {
  const allResources = fromResources.resourceDetailsMap(state?.resources);
  const logs = fromAudit.auditLogs(
    state?.audit,
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
        ['integrations', 'flows', 'connections', 'imports', 'exports', 'accesstokens'].includes(
          resourceTypePlural
        )
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
};

selectors.affectedResourcesAndUsersFromAuditLogs = (
  state,
  resourceType,
  resourceId
) => {
  const logs = selectors.auditLogs(state, resourceType, resourceId);
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
};
