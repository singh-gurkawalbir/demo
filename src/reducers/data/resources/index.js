import produce from 'immer';
import { get, isEqual } from 'lodash';
import { createSelector } from 'reselect';
import sift from 'sift';
import actionTypes from '../../../actions/types';
import { convertOldFlowSchemaToNewOne, getIAFlowSettings, getScriptsReferencedInFlow, isIntegrationApp } from '../../../utils/flows';
import { stringCompare } from '../../../utils/sort';
import mappingUtil from '../../../utils/mapping';
import getRoutePath from '../../../utils/routePaths';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../constants/resource';
import { FILE_PROVIDER_ASSISTANTS } from '../../../utils/constants';

const emptyObject = {};
const emptyList = [];

export const initializationResources = ['profile', 'preferences'];
const accountResources = ['ashares', 'shared/ashares', 'licenses'];
const resourceTypesToIgnore = [
  ...initializationResources,
  ...accountResources,
  'audit',
];

function replaceOrInsertResource(state, resourceType, resourceValue) {
  // handle case of no collection
  let type = resourceType;
  // RESOURCE_RECEIVED is being called with null on some GET resource calls when api doesnt return anything.
  let resource = resourceValue || {};

  if (type.indexOf('/licenses') >= 0) {
    const id = type.substring('connectors/'.length, type.indexOf('/licenses'));

    resource._connectorId = id;
    type = 'connectorLicenses';
  }

  // For accesstokens and connections within an integration
  if (type.indexOf('integrations/') >= 0) {
    type = type.split('/').pop();
  }

  if (type === 'flows') resource = convertOldFlowSchemaToNewOne(resource);

  if (!state[type]) {
    return { ...state, [type]: [resource] };
  }

  // if we have a collection, look for a match
  const collection = state[type];
  const index = collection.findIndex(r => r._id === resource._id);

  // insert if not found, replace if found...
  if (index === -1) {
    return { ...state, [type]: [...collection, resource] };
  }

  // no need to make an update when it is the same resource...this helps in saving some render cycles
  if (isEqual(resource, collection[index])) {
    return state;
  }
  const newCollection = [
    ...collection.slice(0, index),
    resource,
    ...collection.slice(index + 1),
  ];

  return { ...state, [type]: newCollection };
}

function getIntegrationAppsNextState(state, action) {
  const { stepsToUpdate, id } = action;

  return produce(state, draft => {
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
  });
}

export default (state = {}, action) => {
  const {
    id,
    type,
    resource,
    collection,
    resourceType,
    connectionIds,
    integrationId,
    deregisteredId,
    connectionId,
  } = action;

  // Some resources are managed by custom reducers.
  // Lets skip those for this generic implementation
  if (resourceTypesToIgnore.find(t => t === resourceType)) {
    return state;
  }

  // skip integrations/:_integrationId/ashares
  // skip integrations/:_integrationId/audit
  if (
    resourceType &&
    resourceType.startsWith('integrations/') &&
    (resourceType.endsWith('/ashares') || resourceType.endsWith('/audit'))
  ) {
    return state;
  }

  // skip all SuiteScript unification resources
  if (resourceType && resourceType.startsWith('suitescript/connections/')) {
    return state;
  }

  let resourceIndex;
  const newState = { ...state };

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
      if (resourceType.indexOf('/installBase') >= 0) {
        const id = resourceType.substring(
          'connectors/'.length,
          resourceType.indexOf('/installBase')
        );

        // IO-16602, We shouldn't show child integrations in the install base for IAF 2.0 as
        // we can not push update to child integrations. Can identify them by _parentId prop
        const filteredCollection = collection?.filter(c => !c._parentId);

        const newCollection =
          filteredCollection?.map(c => ({ ...c, _connectorId: id }));

        return produce(state, draft => {
          draft.connectorInstallBase = newCollection || [];
        });
      }

      if (resourceType.indexOf('/licenses') >= 0) {
        const id = resourceType.substring(
          'connectors/'.length,
          resourceType.indexOf('/licenses')
        );
        const newCollection =
          collection &&
          collection.map(c => ({
            ...c,
            _connectorId: id,
          }));

        return produce(state, draft => {
          draft.connectorLicenses = newCollection || [];
        });
      }

      if (resourceType === 'recycleBinTTL' && collection && collection.length) {
        return produce(state, draft => {
          draft.recycleBinTTL = collection.map(i => ({...i, key: i.doc._id}));
        });
      }

      // TODO: Raghu, we should move all this code into the "produce" function. Lets talk
      // about it when you have time to refactor.
      if (resourceType === 'flows') {
        return produce(state, draft => {
          const newCollection =
            collection &&
            collection.map &&
            collection.map(convertOldFlowSchemaToNewOne);

          draft.flows = newCollection || [];
        });
      }

      return { ...state, [resourceType]: collection || [] };
    }

    case actionTypes.RESOURCE.RECEIVED:
      return replaceOrInsertResource(state, resourceType, resource);
    case actionTypes.RESOURCE.DELETED:
      if (resourceType.indexOf('/licenses') >= 0) {
        const connectorId = resourceType.substring(
          'connectors/'.length,
          resourceType.indexOf('/licenses')
        );

        return produce(state, draft => {
          draft.connectorLicenses = draft.connectorLicenses.filter(
            l => l._id !== id || l._connectorId !== connectorId
          );
        });
      }

      return {
        ...state,
        [resourceType]: state[resourceType].filter(r => r._id !== id),
      };
    case actionTypes.INTEGRATION_APPS.INSTALLER.STEP.DONE:
      return getIntegrationAppsNextState(state, action);
    case actionTypes.STACK.USER_SHARING_TOGGLED:
      resourceIndex = state.sshares?.findIndex(user => user._id === id);

      if (resourceIndex > -1) {
        return produce(state, draft => {
          draft.sshares[resourceIndex].disabled = !draft.sshares[resourceIndex]
            .disabled;
        });
      }

      return state;

    case actionTypes.CONNECTION.TRADING_PARTNER_UPDATE_COMPLETE: {
      // cant implement immer here with current implementation. Need to revisit again.
      if (connectionIds?.length) {
        connectionIds.forEach(({ _id: cId}) => {
          resourceIndex = newState.connections.findIndex(r => r._id === cId);
          if (resourceIndex !== -1) {
            newState.connections[resourceIndex].ftp.tradingPartner = !(state.connections[resourceIndex].ftp.tradingPartner);
          }
        });

        return newState;
      }

      return state;
    }
    case actionTypes.CONNECTION.DEREGISTER_COMPLETE:
      resourceIndex = state.integrations?.findIndex(
        r => r._id === integrationId
      );

      if (resourceIndex > -1) {
        return produce(state, draft => {
          draft.integrations[
            resourceIndex
          ]._registeredConnectionIds = draft.integrations[
            resourceIndex
          ]._registeredConnectionIds.filter(ele => ele !== deregisteredId);
        });
      }

      return state;

    case actionTypes.CONNECTION.REGISTER_COMPLETE:
      resourceIndex = state.integrations?.findIndex(
        r => r._id === integrationId
      );

      if (resourceIndex > -1) {
        return produce(state, draft => {
          connectionIds.forEach(cId =>
            draft.integrations[resourceIndex]._registeredConnectionIds.push(cId)
          );
        });
      }

      return state;

    case actionTypes.RESOURCE.CLEAR_COLLECTION:
      return produce(state, draft => {
        draft[resourceType] = [];
      });
    case actionTypes.TRANSFER.CANCELLED:
      resourceIndex = state.transfers.findIndex(r => r._id === id);

      // Need to verify why below code is not working
      // if (resourceIndex > -1) {
      //   return produce(state, draft => {
      //     draft.transfers[resourceIndex].status = 'canceled';
      //   });
      // }
      if (resourceIndex > -1) {
        newState.transfers[resourceIndex].status = 'canceled';

        return newState;
      }

      return state;
    case actionTypes.ACCESSTOKEN_DELETE_PURGED:
      return produce(state, draft => {
        draft.accesstokens = draft.accesstokens.filter(
          token =>
            !token.autoPurgeAt || new Date(token.autoPurgeAt) > new Date()
        );
      });
    case actionTypes.CONNECTION.UPDATE_STATUS: {
      return produce(state, draft => {
        if (collection?.length) {
          collection.forEach(({ _id: cId, offline, queues }) => {
            resourceIndex = draft?.connections?.findIndex(r => r._id === cId);
            if (resourceIndex >= 0) {
              draft.connections[resourceIndex].offline = !!offline;
              draft.connections[resourceIndex].queueSize = queues[0].size;
            }
          });
        }
      });
    }
    case actionTypes.CONNECTION.MADE_ONLINE:
      if (!state.tiles) {
        return state;
      }

      return produce(state, draft => {
        draft.tiles = draft.tiles.map(tile => {
          if (tile.offlineConnections) {
            // eslint-disable-next-line no-param-reassign
            tile.offlineConnections = tile.offlineConnections.filter(
              c => c !== connectionId
            );
          }

          return tile;
        });
      });

    default:
      return state;
  }
};

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
          draft.stores = draft.settings.sections.map(s => ({
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

selectors.defaultStoreId = (state, id, store) => {
  const settings = integrationAppSettings(state, id);

  if (settings && settings.stores && settings.stores.length) {
    if (settings.stores.find(s => s.value === store)) {
      return store;
    }

    // If the first store in the integration is in incomplete state or uninstall mode, on clicking the tile from dashboard
    // user will be redirected directly to uninstall steps or install steps, which may confuse user.
    // As done in ampersand, will select first "valid" store available as defaullt store.
    return (
      (settings.stores.find(s => s.mode === 'settings') || {}).value ||
      settings.stores[0].value
    );
  }

  return undefined;
};
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
    const flowId = r._flowIds[0];
    const flow = flows.find(({_id}) => _id === flowId);

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

        if (state[resourceType] && state[resourceType].length) {
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
