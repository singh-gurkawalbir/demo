import produce from 'immer';
import { get } from 'lodash';
import { createSelector } from 'reselect';
import sift from 'sift';
import reduceReducers from 'reduce-reducers';
import actionTypes from '../../../actions/types';
import { getIAFlowSettings, getScriptsReferencedInFlow, isIntegrationApp } from '../../../utils/flows';
import { stringCompare } from '../../../utils/sort';
import mappingUtil from '../../../utils/mapping';
import getRoutePath from '../../../utils/routePaths';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../constants/resource';
import { FILE_PROVIDER_ASSISTANTS } from '../../../utils/constants';
import connectionUpdateReducer from './connectionUpdate';
import resourceUpdateReducer from './resourceUpdate';

const emptyObject = {};
const emptyList = [];

function setIntegrationAppsNextState(draft, action) {
  const { stepsToUpdate, id } = action;

  const integration = draft.integrations.find(i => i._id === id);

  if (
    !integration ||
      !(
        (integration.install && integration.install.length) ||
        (integration.installSteps && integration.installSteps.length)
      )
  ) {
    return;
  }

  if (integration.installSteps && integration.installSteps.length) {
    stepsToUpdate &&
        stepsToUpdate.forEach(step => {
          const stepIndex = integration.installSteps.findIndex(
            s => s.name === step.name
          );

          if (stepIndex !== -1) {
            integration.installSteps[stepIndex] = {
              ...integration.installSteps[stepIndex],
              ...step,
            };
          }
        });
  } else {
    stepsToUpdate &&
        stepsToUpdate.forEach(step => {
          const stepIndex = integration.install.findIndex(
            s =>
              (step.installerFunction &&
                s.installerFunction === step.installerFunction) ||
              (step.name && s.name === step.name)
          );

          if (stepIndex !== -1) {
            integration.install[stepIndex] = {
              ...integration.install[stepIndex],
              ...step,
            };
          }
        });
  }
}

const rootDataReducer = (state = {}, action) => {
  const {
    id,
    type,
  } = action;

  return produce(state, draft => {
    let resourceIndex;

    switch (type) {
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP.DONE:
        return setIntegrationAppsNextState(draft, action);
      case actionTypes.STACK.USER_SHARING_TOGGLED:
        resourceIndex = draft.sshares?.findIndex(user => user._id === id);

        if (resourceIndex > -1) {
          draft.sshares[resourceIndex].disabled = !draft.sshares[resourceIndex]
            .disabled;

          return;
        }

        return;

      case actionTypes.TRANSFER.CANCELLED:
        resourceIndex = draft.transfers.findIndex(r => r._id === id);
        if (resourceIndex > -1) {
          draft.transfers[resourceIndex].status = 'canceled';

          return;
        }

        return;
      case actionTypes.ACCESSTOKEN_DELETE_PURGED:

        draft.accesstokens = draft.accesstokens.filter(
          token =>
            !token.autoPurgeAt || new Date(token.autoPurgeAt) > new Date()
        );

        return;

      default:
        return draft;
    }
  });
};

export default reduceReducers(rootDataReducer, connectionUpdateReducer, resourceUpdateReducer);

export const selectors = {};

selectors.resourceIdState = (state, resourceType, id) => {
  if (!state || !id || !resourceType) {
    return null;
  }

  const resources = state[resourceType];

  if (!resources) return null;

  return resources.find(r => r._id === id);
};

// #region PUBLIC SELECTORS
// TODO:Deprecate this selector and use makeResourceSelector
selectors.resource = (state, resourceType, id) => {
  // console.log('fetch', resourceType, id);

  const match = selectors.resourceIdState(state, resourceType, id);

  if (!match) return null;

  // TODO: Santosh. This is an example of a bad practice where the selector, which should
  // only return some part of the state, is actually mutating the state prior to returning
  // the value.  Instead, the reducer should do the work of normalizing the data if needed.
  // I don't know why this code is here. Either the RECEIVE_RESOURCE_* should do this, or
  // the components) using this property should be smart enough to work with an undefined prop.
  // Could you find the best solution for this? I favour the latter if that approach is easy.
  if (['exports', 'imports'].includes(resourceType)) {
    if (match.assistant && !match.assistantMetadata) {
      // TODO:mutating a reference of the redux state..we have to fix this
      // if this reducer was implemented in immer ...it would have pointed this error
      match.assistantMetadata = {};
    }
  }

  return match;
};

/** returns 1st Page generator for a flow */
selectors.firstFlowPageGenerator = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (flow?.pageGenerators?.length) {
    const exportId = flow.pageGenerators[0]._exportId;

    return selectors.resource(state, 'exports', exportId);
  }

  return emptyObject;
};

selectors.rdbmsConnectionType = (state, connectionId) => {
  const connection = selectors.resource(state, 'connections', connectionId) || {};

  return connection.rdbms && connection.rdbms.type;
};

selectors.mappingExtractGenerateLabel = (state, flowId, resourceId, type) => {
  if (type === 'generate') {
    /** generating generate Label */
    const importResource = selectors.resource(state, 'imports', resourceId);
    const importConn = selectors.resource(state, 'connections', importResource?._connectionId);

    return `Import field (${mappingUtil.getApplicationName(
      importResource,
      importConn
    )})`;
  }
  if (type === 'extract') {
    /** generating extract Label */
    const flow = selectors.resource(state, 'flows', flowId);

    if (flow && flow.pageGenerators && flow.pageGenerators.length && flow.pageGenerators[0]._exportId) {
      const {_exportId} = flow.pageGenerators[0];
      const exportResource = selectors.resource(state, 'exports', _exportId);
      const exportConn = selectors.resource(state, 'connections', exportResource?._connectionId);

      return `Export field (${mappingUtil.getApplicationName(
        exportResource,
        exportConn
      )})`;
    }

    return 'Source record field';
  }
};

selectors.mappingImportSampleDataSupported = (state, importId) => {
  const importResource = selectors.resource(state, 'imports', importId);

  const isAssistant =
  !!importResource.assistant && importResource.assistant !== 'financialforce' && !(FILE_PROVIDER_ASSISTANTS.includes(importResource.assistant));
  const isIAResource = isIntegrationApp(importResource);

  return isAssistant || isIAResource || ['NetSuiteImport', 'NetSuiteDistributedImport', 'SalesforceImport'].includes(importResource?.adaptorType);
};

selectors.redirectUrlToResourceListingPage = (
  state,
  resourceType,
  resourceId
) => {
  if (resourceType === 'integration') {
    return getRoutePath(`/integrations/${resourceId}/flows`);
  }

  if (resourceType === 'flow') {
    const flow = selectors.resource(state, 'flows', resourceId);

    if (flow) {
      return getRoutePath(
        `integrations/${flow._integrationId || 'none'}/flows`
      );
    }
  }

  return getRoutePath(RESOURCE_TYPE_SINGULAR_TO_PLURAL[resourceType]);
};

selectors.mappingSubRecordAndJSONPath = (state, importId, subRecordMappingId) => {
  const importResource = selectors.resource(state, 'imports', importId);

  if (subRecordMappingId && ['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importResource.adaptorType)) {
    return mappingUtil.getSubRecordRecordTypeAndJsonPath(importResource, subRecordMappingId);
  }

  return emptyObject;
};

// transformed from above selector
function resourceTransformed(resourceIdState, resourceType) {
  if (!resourceIdState) return null;

  // TODO: Santosh. This is an example of a bad practice where the selector, which should
  // only return some part of the state, is actually mutating the state prior to returning
  // the value.  Instead, the reducer should do the work of normalizing the data if needed.
  // I don't know why this code is here. Either the RECEIVE_RESOURCE_* should do this, or
  // the components) using this property should be smart enough to work with an undefined prop.
  // Could you find the best solution for this? I favour the latter if that approach is easy.
  if (['exports', 'imports'].includes(resourceType)) {
    if (resourceIdState.assistant && !resourceIdState.assistantMetadata) {
      return { ...resourceIdState, assistantMetadata: {} };
    }
  }

  return resourceIdState;
}

selectors.makeResourceSelector = () => createSelector(
  (state, resourceType, id) => selectors.resourceIdState(state, resourceType, id),
  (_, resourceType) => resourceType,
  (resourceIdState, resourceType) => resourceTransformed(resourceIdState, resourceType)
);

selectors.exportNeedsRouting = (state, id) => {
  if (!state) return false;

  const allExports = state.exports;

  if (!allExports || allExports.length === 0) return false;

  const exp = allExports.find(r => r._id === id);

  if (!exp || exp.adaptorType !== 'AS2Export') return false;

  const as2ConnectionId = exp._connectionId;

  if (!as2ConnectionId) return false;

  const siblingExports = allExports.filter(
    e => e._connectionId === as2ConnectionId
  );

  // only AS2 exports that share their connection with another export need routing.
  return siblingExports.length >= 2;
};

selectors.connectionHasAs2Routing = (state, id) => {
  if (!state) return false;

  const connection = selectors.resource(state, 'connections', id);

  if (!connection) return false;

  return !!(
    connection.as2 &&
    connection.as2.contentBasedFlowRouter &&
    connection.as2.contentBasedFlowRouter._scriptId
  );
};

selectors.mappingNSRecordType = (state, importId, subRecordMappingId) => {
  const importResource = selectors.resource(state, 'imports', importId);

  if (!importResource) return;
  const {adaptorType} = importResource;

  if (!['NetSuiteImport', 'NetSuiteDistributedImport'].includes(adaptorType)) {
    return;
  }
  if (subRecordMappingId) {
    const { recordType } = mappingUtil.getSubRecordRecordTypeAndJsonPath(
      importResource,
      subRecordMappingId
    );

    return recordType;
  }

  // give precedence to netsuite_da
  return importResource.netsuite_da?.recordType || importResource.netsuite?.recordType;
};

selectors.isIntegrationApp = (state, integrationId) => {
  const integration = selectors.resource(state,
    'integrations',
    integrationId
  );

  return !!(integration && integration._connectorId);
};

selectors.integrationInstallSteps = (state, id) => {
  const integration = selectors.resource(state, 'integrations', id);

  if (
    !integration ||
    !(
      (integration.install && integration.install.length) ||
      (integration.installSteps && integration.installSteps.length)
    )
  ) {
    return emptyList;
  }

  // TODO: These two next blocks seem strange to me. They do NOT
  // mutate the app state since produce is used to return an new object (good thing),
  // but these selectors will always return a new object because of this.
  // its probably an easy change to have the component logic find the current step
  // instead. Thus always returning the same steps, and only re-rendering the component
  // when the steps themselves change.
  if (integration.installSteps && integration.installSteps.length) {
    return produce(integration.installSteps, draft => {
      if (draft.find(step => !step.completed)) {
        draft.find(step => !step.completed).isCurrentStep = true;
      }
    });
  }

  return produce(integration.install, draft => {
    if (draft.find(step => !step.completed)) {
      draft.find(step => !step.completed).isCurrentStep = true;
    }
  });
};

selectors.mkFlowGroupingsSections = () => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, integrationId) => resourceSelector(state, 'integrations', integrationId)?.flowGroupings,
    groupings => {
      if (!groupings || !groupings.length) { return null; }

      return groupings.map(({name, _id}) => ({title: name, sectionId: _id }));
    }
  );
};

selectors.flowGroupingsSections = selectors.mkFlowGroupingsSections();
selectors.mkGetAllCustomFormsForAResource = () => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, resourceType, resourceId) => resourceSelector(state, resourceType, resourceId),
    (_1, resourceType) => resourceType,
    (resource, resourceType) => {
      if (!resource) return null;
      const {settingsForm, settings, flowGroupings} = resource;
      const settingsMeta = {settingsForm, settings, title: 'General', sectionId: 'general'};

      const noFlowGroupings = {allSections: [settingsMeta], hasFlowGroupings: false};

      // flowGroupings present for only in integrations
      if (resourceType !== 'integrations') { return noFlowGroupings; }

      // if the integration does not have it
      if (!flowGroupings || !flowGroupings.length) {
        return noFlowGroupings;
      }

      return {allSections: [settingsMeta, ...flowGroupings.map(({name, _id, settingsForm, settings}) =>
        ({ title: name, sectionId: _id, settingsForm, settings }))],
      hasFlowGroupings: true,
      };
    }
  );
};
selectors.getAllSections = selectors.mkGetAllCustomFormsForAResource();
selectors.mkGetCustomFormPerSectionId = () => {
  const sectionsMetadata = selectors.mkGetAllCustomFormsForAResource();

  return createSelector(

    (state, resourceType, resourceId) => sectionsMetadata(state, resourceType, resourceId),
    (_1, _2, _3, sectionId) => sectionId,
    (metadata, sectionId) => {
      if (!metadata) return null;
      const {allSections} = metadata;

      if (!allSections) return null;

      return allSections.find(ele => ele.sectionId === sectionId);
    }
  );
};

selectors.getSectionMetadata = selectors.mkGetCustomFormPerSectionId();
// TODO: Santosh, All this selector does is transform the integration settings.
// Its probably best if the component uses the resource selector directly
// to fetch the integration, then use a util method to do the transform
// currently done in this selector.  This way the data-layer team cold still
// manage the below logic (and easily test it by applying tests to the integrationUtil.js file)
// and the component developer ALMOST has the same experience, wherein the just
// need to pass the integration resource to the new util method for the transformation to take
// effect.

selectors.mkIntegrationAppSettings = subState => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector((state, id) => resourceSelector(subState ? state : state?.data?.resources, 'integrations', id) || null,
    integration => {
      if (!integration) {
        return null;
      }

      return produce(integration, draft => {
        if (!draft.settings) {
          draft.settings = emptyObject;
        }
        if (draft.settings.general) {
          draft.settings.hasGeneralSettings = true;
        }
        if (draft.settings.supportsMultiStore) {
          draft.children = draft.settings.sections.map(s => ({
            label: s.title,
            hidden: !!s.hidden,
            mode: s.mode || 'settings',
            value: s.id,
          }));
        }
      });
    }
  );
};

export const integrationAppSettings = selectors.mkIntegrationAppSettings(true);

const filterByEnvironmentResources = (resources, flows, sandbox, resourceType) => {
  const filterByEnvironment = typeof sandbox === 'boolean';

  if (!filterByEnvironment) { return resources; }

  if (resourceType !== 'eventreports') {
    return resources.filter(r => !!r.sandbox === sandbox);
  }

  // event reports needs flows to determine the environment
  if (!flows) { return []; }

  // eventReports
  return resources.filter(r => {
    // the flows environment is the same for eventreport
    const {_flowIds: flowIds} = r;
    const flow = flows.find(({_id}) => flowIds.includes(_id));

    // this happens in the case where a flow is deleted ..
    // without the flow we cannot determine the environment in that case we will just not
    // list the eventReport
    if (!flow) return false;

    return !!flow.sandbox === sandbox;
  });
};

selectors.resources = (state, resourceType) => {
  if (!state || !resourceType) return emptyList;

  return state[resourceType] || emptyList;
};

selectors.resourceList = (
  state,
  { type, take, keyword, sort, sandbox, filter, searchBy }
) => {
  const result = {
    resources: [],
    type,
    total: 0,
    filtered: 0,
    count: 0,
  };
  // console.log('selector args', state, name, take, keyword);

  if (!state || !type || typeof type !== 'string') {
    return result;
  }

  if (type === 'ui/assistants') {
    return state[type];
  }

  const resources = state[type];

  if (!resources) return result;

  result.total = resources.length;
  result.count = resources.length;

  function searchKey(resource, key) {
    if (key === 'environment') {
      return get(resource, 'sandbox') ? 'Sandbox' : 'Production';
    }

    const value = get(resource, key);

    return typeof value === 'string' ? value : '';
  }

  const stringTest = r => {
    if (!keyword) return true;
    const searchableText =
      Array.isArray(searchBy) && searchBy.length
        ? `${searchBy.map(key => searchKey(r, key)).join('|')}`
        : `${r._id}|${r.name}|${r.description}`;

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };
  const matchTest = rOrig => {
    const r = type === 'recycleBinTTL' ? rOrig?.doc : rOrig;

    return stringTest(r);
  };

  const comparer = ({ order, orderBy }) =>
    order === 'desc' ? stringCompare(orderBy, true) : stringCompare(orderBy);
  // console.log('sort:', sort, resources.sort(comparer, sort));
  const sorted = sort ? [...resources].sort(comparer(sort)) : resources;

  const filteredByEnvironment = filterByEnvironmentResources(sorted, state?.flows, sandbox, type);

  const filtered = filteredByEnvironment.filter(
    filter ? sift({ $and: [filter, matchTest] }) : matchTest
  );

  result.filtered = filtered.length;
  result.resources = filtered;

  if (typeof take !== 'number' || take < 1) {
    return result;
  }

  const slice = filtered.slice(0, take);

  return {
    ...result,
    resources: slice,
    count: slice.length,
  };
};

selectors.resourceState = state => state;

selectors.hasData = (state, resourceType) => !!(state && state[resourceType]);

selectors.resourceDetailsMap = createSelector(
  state => state,
  state => {
    const allResources = {};

    if (!state) {
      return allResources;
    }

    Object.keys(state).forEach(resourceType => {
      if (!['published', 'tiles'].includes(resourceType)) {
        allResources[resourceType] = {};

        if (state[resourceType] && Array.isArray(state[resourceType])) {
          state[resourceType].forEach(resource => {
            allResources[resourceType][resource._id] = {
              name: resource.name,
            };

            if (resource._integrationId) {
              allResources[resourceType][resource._id]._integrationId =
                resource._integrationId;
            }

            if (resource._connectorId) {
              allResources[resourceType][resource._id]._connectorId =
                resource._connectorId;
            }

            if (resourceType === 'flows') {
              allResources[resourceType][
                resource._id
              ].numImports = resource.pageProcessors
                ? resource.pageProcessors.length
                : 1;
              allResources[resourceType][resource._id].disabled = resource.disabled;
            }
          });
        }
      }
    });

    return allResources;
  }
);

const hasFormData = settingsForm => !!(settingsForm && (settingsForm.form || settingsForm.init));

const getSectionMetadata = selectors.mkGetCustomFormPerSectionId();

selectors.hasSettingsForm = (state, resourceType, resourceId, sectionId) => {
  if (sectionId) {
    // it is an integration
    const integrationSectionMetadata = getSectionMetadata(state, resourceType, resourceId, sectionId);

    return hasFormData(integrationSectionMetadata?.settingsForm);
  }
  const res = selectors.resource(state, resourceType, resourceId);
  const settingsForm = res && res.settingsForm;

  return hasFormData(settingsForm);
};

selectors.iaFlowSettings = (state, integrationId, flowId, childId) => {
  const integration = selectors.resource(state, 'integrations', integrationId);

  return getIAFlowSettings(integration, flowId, childId);
};

// #endregion

// #region script selectors

selectors.mkGetScriptsTiedToFlow = () => createSelector(
  state => state?.scripts,
  (state, flowId) => {
    if (!flowId) {
      return;
    }

    return state?.flows?.find(({_id}) => _id === flowId);
  },
  state => state?.imports,
  state => state?.exports,
  (scripts, flow, imports, exports) => {
    if (!scripts || !flow) {
      return null;
    }

    return getScriptsReferencedInFlow({scripts, flow, imports, exports});
  });

// #endregion script selectors

// #region eventReports selectors
selectors.isAnyReportRunningOrQueued = (state, reportType) => {
  if (!state) { return false; }

  const eventReports = selectors.resources(state, reportType);

  if (!eventReports) { return false; }

  return eventReports.some(eventReport => ['running', 'queued'].includes(eventReport?.status));
};

// #endregion eventReports selectors
