import { call, put, takeEvery, select, take, cancel, fork, takeLatest, race, all } from 'redux-saga/effects';
import jsonPatch, { deepClone } from 'fast-json-patch';
import { isEqual, isBoolean, isEmpty } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { isNewId } from '../../utils/resource';
import metadataSagas from './meta';
import getRequestOptions, { pingConnectionParentContext } from '../../utils/requestOptions';
import { defaultPatchSetConverter } from '../../forms/formFactory/utils';
import conversionUtil from '../../utils/httpToRestConnectionConversionUtil';
import importConversionUtil from '../../utils/restToHttpImportConversionUtil';
import { GET_DOCS_MAX_LIMIT, NON_ARRAY_RESOURCE_TYPES, REST_ASSISTANTS, HOME_PAGE_PATH } from '../../utils/constants';
import { resourceConflictResolution } from '../utils';
import { isIntegrationApp } from '../../utils/flows';
import { updateFlowDoc } from '../resourceForm';
import { pingConnectionWithId } from '../resourceForm/connections';
import { pollApiRequests } from '../app';

const STANDARD_DELAY_FOR_POLLING = 5 * 1000;

export function* isDataLoaderFlow(flow) {
  if (!flow) return false;

  // assume old DL interface
  let exportId = flow._exportId;

  // override if new interface present.
  if (flow.pageGenerators?.length > 0) {
    exportId = flow.pageGenerators[0]._exportId;
  }

  if (!exportId) return false;

  // we have a flow with an export. Is this export a data loader? (type=simple)
  const data = yield select(selectors.resourceData, 'exports', exportId);
  const exp = data.merged;

  if (exp?.type === 'simple') {
    // console.log('we have a data loader flow!');

    return true;
  }

  return false;
}

export function* resourceConflictDetermination({
  path,
  merged,
  id,
  scope,
  resourceType,
  master,
}) {
  let origin;

  try {
    origin = yield call(apiCallWithRetry, { path });
  } catch (error) {
    return { error };
  }

  yield put(actions.resource.received(resourceType, origin));

  const { conflict, merged: updatedMerged } = yield resourceConflictResolution({
    merged,
    master,
    origin,
  });

  if (conflict) {
    yield put(actions.resource.commitConflict(id, conflict, scope));
  }

  return { conflict: !!conflict, merged: updatedMerged };
}

export function* linkUnlinkSuiteScriptIntegrator({ connectionId, link }) {
  if (!isBoolean(link)) {
    return;
  }
  const userPreferences = yield select(selectors.userPreferences);
  const isLinked = userPreferences?.ssConnectionIds?.includes(connectionId);
  const isAccountOwnerOrAdmin = yield select(selectors.isAccountOwnerOrAdmin);

  if (isAccountOwnerOrAdmin) {
    if (link) {
      if (!isLinked) {
        yield put(
          actions.user.preferences.update({
            ssConnectionIds: [...(userPreferences.ssConnectionIds || []), connectionId],
          })
        );
      }
    } else if (isLinked) {
      yield put(
        actions.user.preferences.update({
          ssConnectionIds: userPreferences.ssConnectionIds.filter(
            id => id !== connectionId
          ),
        })
      );
    }
  } else if (link) {
    if (!isLinked) {
      yield put(actions.user.org.accounts.addLinkedConnectionId(connectionId));
    }
  } else if (isLinked) {
    yield put(actions.user.org.accounts.deleteLinkedConnectionId(connectionId));
  }
}

export function* requestRevoke({ connectionId, hideNetWorkSnackbar = false }) {
  const path = `/connection/${connectionId}/revoke`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      hidden: hideNetWorkSnackbar,
      opts: {
        method: 'GET',
      },
      message: 'Revoking Connection',
    });

    if (response?.errors) {
      yield put(
        actions.api.failure(path, 'GET', JSON.stringify(response.errors), hideNetWorkSnackbar)
      );
    }
  } catch (error) {
    return undefined;
  }
}

export function* commitStagedChanges({ resourceType, id, scope, options, context, parentContext }) {
  const userPreferences = yield select(selectors.userPreferences);
  const isSandbox = userPreferences
    ? userPreferences.environment === 'sandbox'
    : false;
  const data = yield select(selectors.resourceData, resourceType, id, scope);
  const { patch, master } = data;
  let { merged } = data;
  const isNew = isNewId(id);

  // console.log('commitStaged saga', resourceType, id, patch, merged, master);

  if (!patch || !patch.length) return; // nothing to do.

  // integrations/<id>/connections for create and /connections for update
  // For accesstokens and connections within an integration for edit case
  if (!isNew && resourceType.startsWith('integrations/')) {
    // eslint-disable-next-line no-param-reassign
    resourceType = resourceType.split('/').pop();
  }

  let path = isNew ? `/${resourceType}` : `/${resourceType}/${id}`;

  // only updates need to check for conflicts.
  if (!isNew) {
    const resp = yield call(resourceConflictDetermination, {
      path,
      merged,
      id,
      scope,
      resourceType,
      master,
    });

    if (resp && (resp.error || resp.conflict)) return resp;
    // eslint-disable-next-line prefer-destructuring
    merged = resp.merged;
  } else if (
    ['exports', 'imports', 'connections', 'flows', 'integrations', 'apis', 'eventreports'].includes(
      resourceType
    ) || (resourceType.startsWith('integrations/') && resourceType.endsWith('connections'))
  ) {
    // For Cloning, the preference of environment is set by user during clone setup. Do not override that preference
    // For all other cases, set the sandbox property to current environment
    if (merged && !Object.prototype.hasOwnProperty.call(merged, 'sandbox')) merged.sandbox = isSandbox;
  }

  let updated;

  if (resourceType === 'connections' && !isNew) {
    // netsuite tba-auto creates new tokens on every save and authorize. As there is limit on
    // number of active tokens on netsuite, revoking token when user updates token-auto connection.
    if (merged.type === 'netsuite') {
      const isTokenToBeRevoked = master.netsuite?.authType === 'token-auto';

      if (isTokenToBeRevoked) {
        yield call(requestRevoke, { connectionId: master._id, hideNetWorkSnackbar: true });
      }
    }
    // add parentContext to merged for only put connection calls
    merged = {
      ...merged,
      ...pingConnectionParentContext(parentContext),
    };
  }

  // We built all connection assistants on HTTP adaptor on React. With recent changes to decouple REST deprecation
  // and React we are forced to convert HTTP to REST doc for existing REST assistants since we don't want to build
  // 150 odd connection assistants again. Once React becomes the only app and when assistants are migrated we would
  // remove this code and let all docs be built on HTTP adaptor.
  if (
    // if it matches integrations/<id>/connections when creating a connection
    (resourceType === 'connections' || (resourceType.startsWith('integrations/') && resourceType.endsWith('connections'))) &&
    merged.assistant &&
    REST_ASSISTANTS.indexOf(merged.assistant) > -1
  ) {
    merged = conversionUtil.convertConnJSONObjHTTPtoREST(merged);
  }

  // Forimports convert the lookup structure and rest placeholders to support http structure
  if (!merged.assistant && merged?.http?.formType === 'rest' && merged.adaptorType === 'HTTPImport') {
    merged = importConversionUtil.convertImportJSONObjRESTtoHTTP(merged);
  }
  if (resourceType === 'exports' && merged._rest) {
    delete merged._rest;
  }

  // When integrationId is set on connection model, integrations/:_integrationId/connections route will be used
  // and connection will be auto registered to the integration.
  // This is required for tile level monitor access users
  if (resourceType === 'connections' && merged.integrationId && isNew) {
    path = `/integrations/${merged.integrationId}/connections`;
  }

  // #region Temp Data loader code
  // For consistency, we normalize the client code to use the new pageProcessor and pageGenerator fields
  // in favor of the old _exportId and _importId fields.  The Data loader (export type = simple) flows
  // only support the older interface, so we need to convert back before we make the PUT/POST API call.
  // this complete code block can be removed once the BE DL code uses the new flow interface fields.
  let resourceIsDataLoaderFlow = false;

  if (resourceType === 'flows') {
    resourceIsDataLoaderFlow = yield call(isDataLoaderFlow, merged);
    // this value 'flowConvertedToNewSchema' has been set at the time of caching a flow collection.... we convert it to the new schema
    // and set this flag 'flowConvertedToNewSchema' to true if we find it to be in the old schema...now when we are actually commiting the resource
    // we reverse this process and convert it back to the old schema ...also we delete this flag

    if (
      resourceIsDataLoaderFlow ||
      (merged.flowConvertedToNewSchema && isIntegrationApp(merged))
    ) {
      if (merged.pageGenerators && merged.pageGenerators.length > 0) {
        merged._exportId = merged.pageGenerators[0]._exportId;
        delete merged.pageGenerators;
      }

      if (merged.pageProcessors && merged.pageProcessors.length > 0) {
        const importId = merged.pageProcessors[0]._importId;

        if (importId) {
          merged._importId = importId;
          delete merged.pageProcessors;
        }
      }
    }

    delete merged.flowConvertedToNewSchema;
  }
  // #endregion

  try {
    updated = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: isNew ? 'post' : 'put',
        body: merged,
      },
    });
  } catch (error) {
    // TODO: What should we do for 4xx errors? where the resource to put/post
    // violates some API business rules?

    if (options && options.action === 'flowEnableDisable') {
      yield put(actions.flow.isOnOffActionInprogress(false, id));
    }

    return { error };
  }
  if (options?.action === 'UpdatedIA2.0Settings') {
    yield put(actions.resource.requestCollection('exports', null, true));
    yield put(actions.resource.requestCollection('imports', null, true));
  }

  // HACK! when updating scripts, since content is stored in s3, it
  // seems the PUT API response does not contain the content. We need to
  // insert it to prevent unwanted GET requests.
  if (
    resourceType === 'scripts' &&
    merged.content &&
    updated.content === undefined
  ) {
    updated.content = merged.content;
  }

  // when data is posted /integrations/:integrationId/connections, connection created will be auto-registered to integration.
  // Refetch the integration
  if (resourceType === 'connections' && merged.integrationId && isNew) {
    // eslint-disable-next-line no-use-before-define
    yield call(getResource, { resourceType: 'integrations', id: merged.integrationId });
  }

  /*
     connections can be saved with valid or invalid credentials(i.e whether ping succeeded or failed)
     calling ping after connection save sets the offline flag appropriately in the backend.
     UI shouldnt set offline flag. It should read status from db.
  */
  if (resourceType === 'connections' && updated?._id && isNew) {
    try {
      yield call(pingConnectionWithId, { connectionId: updated._id, parentContext });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  // #region Data loader transform
  // This code can be removed (with above DL code) once the BE DL code supports
  // the new flow interface. For now we "fake" compatibility and convert on load/save
  if (resourceIsDataLoaderFlow) {
    // console.log('commit DL convert to old interface on api');
    updated.pageGenerators = [{ _exportId: updated._exportId }];
    delete updated._exportId;

    if (updated._importId) {
      updated.pageProcessors = [
        { _importId: updated._importId, type: 'import' },
      ];
      delete updated._importId;
    }
  }
  // #endregion

  if (['exports', 'imports'].includes(resourceType)) {
    if (
      merged.assistant &&
      merged.assistantMetadata &&
      !isEqual(merged.assistantMetadata, updated.assistantMetadata)
    ) {
      const assistantMetadata = merged.assistantMetadata || {};

      try {
        yield call(apiCallWithRetry, {
          path: `/${resourceType}/${updated._id}`,
          opts: {
            method: 'PATCH',
            body: [
              {
                op: 'replace',
                path: '/assistantMetadata',
                value: merged.assistantMetadata || {},
              },
            ],
          },
        });
      } catch (error) {
        return { error };
      }

      updated.assistantMetadata = assistantMetadata;
      // Fix for updating lastModified after above patch request
      // @TODO: Raghu Remove this once patch request gives back the resource in response
      const origin = yield call(apiCallWithRetry, {
        path: `/${resourceType}/${updated._id}`,
      });

      updated.lastModified = origin.lastModified;
    }
  }

  yield put(actions.resource.clearStaged(id, scope));

  yield put(actions.resource.received(resourceType, updated));

  if (!isNew) {
    yield put(actions.resource.updated(resourceType, updated._id, master, patch, context));
  }

  if (options && options.action === 'flowEnableDisable') {
    yield put(actions.flow.isOnOffActionInprogress(false, id));
  }

  if (isNew) {
    yield put(actions.resource.created(updated._id, id, resourceType));
  }

  if (resourceType === 'connections' && merged.type === 'netsuite') {
    yield call(
      linkUnlinkSuiteScriptIntegrator,
      { connectionId: merged._id,
        link: merged.netsuite.linkSuiteScriptIntegrator }
    );
  }
}
export function* commitStagedChangesWrapper({ asyncKey, ...props }) {
  // if asyncKey is defined we should try tagging with async updates
  if (asyncKey) {
    yield put(actions.asyncTask.start(asyncKey));
    const resp = yield call(commitStagedChanges, props);

    if (resp?.error) {
    // save error message
      yield put(actions.asyncTask.failed(asyncKey));

      return resp;
    }
    yield put(actions.asyncTask.success(asyncKey));

    return resp;
  }

  return yield call(commitStagedChanges, props);
}
export function* downloadFile({ resourceType, id }) {
  const { path, opts } = getRequestOptions(actionTypes.RESOURCE.DOWNLOAD_FILE, {
    resourceId: id,
    resourceType,
  });
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Download Zip File',
    });
    window.open(response.signedURL, 'target=_blank', response.options, false);
  } catch (e) {
    return true;
  }
}

export function* normalizeFlow(flow) {
  const isDataLoader = yield call(isDataLoaderFlow, flow);

  if (!isDataLoader) return flow;

  const newFlow = flow;

  if (newFlow._importId) {
    newFlow.pageProcessors = [{ _importId: flow._importId, type: 'import' }];
    delete newFlow._importId;
  }

  if (newFlow._exportId) {
    newFlow.pageGenerators = [{ _exportId: flow._exportId }];
    delete newFlow._exportId;
  }

  return newFlow;
}
export function* getResource({ resourceType, id, message, hidden }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
    let resource = yield call(apiCallWithRetry, { path, message, hidden });

    console.log('check res', resource, path);
    if (resourceType === 'flows') {
      resource = yield call(normalizeFlow, resource);
    }

    yield put(actions.resource.received(resourceType, resource));

    return resource;
  } catch (error) {
    return undefined;
  }
}
export function* updateIntegrationSettings({
  childId,
  integrationId,
  values,
  flowId,
  sectionId,
  options = {},
}) {
  const path = `/integrations/${integrationId}/settings/persistSettings`;
  let payload = jsonPatch.applyPatch({}, defaultPatchSetConverter(values))
    .newDocument;

  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const supportsMultiStore = integration?.settings?.supportsMultiStore;
  let finalChildId = childId;

  if (supportsMultiStore && !childId && flowId) {
    finalChildId = yield select(selectors.integrationAppChildIdOfFlow, integrationId, flowId);
  }

  if (finalChildId) {
    payload = { [finalChildId]: payload };
  }

  payload = {
    pending: payload,
  };

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Saving integration settings',
    });
    // eslint-disable-next-line no-empty
  } catch (e) {
    if (options.action === 'flowEnableDisable') {
      yield put(actions.flow.isOnOffActionInprogress(false, flowId));
    }

    return yield put(
      actions.integrationApp.settings.submitFailed({
        childId: finalChildId,
        integrationId,
        response,
        flowId,
        sectionId,
      })
    );
  }

  if (response) {
    // if flowId is present touch the flow to show changed lastModified date
    // note this is somewhat a hack
    // it is believed that in time resource level settings will render this obsolete
    if (flowId && options.action !== 'flowEnableDisable') {
      yield call(updateFlowDoc, { flowId, resourceType: 'integrations', resourceId: integrationId });
    }

    // If settings object is sent to response, we need to refetch resources as they are modified by IA
    if (response.settings) {
      yield put(actions.resource.requestCollection('exports', null, true));
      yield put(actions.resource.requestCollection('flows', null, true));
    }

    // integration doc will be update by IA team, need to refetch to get latest copy from db.
    yield call(getResource, { resourceType: 'integrations', id: integrationId });

    if (response._flowId) {
      // when Save button on section triggers a flow on integrationApp, it will send back _flowId in the response.
      // UI should navigate to the integration dashboard so that user can the see the flow status.
      yield put(
        actions.resource.integrations.redirectTo(integrationId, 'dashboard')
      );
    }

    // If persistSettings is called for IA flow enable/disable
    if (options.action === 'flowEnableDisable') {
      if (response.success) {
        // eslint-disable-next-line no-use-before-define
        yield call(getResource, { resourceType: 'flows', id: flowId });
        const flow = yield select(selectors.resource, 'flows', flowId);
        const patchSet = [
          {
            op: 'replace',
            path: '/disabled',
            // IA sends back pending object containing flow state, patch that state to data store
            value: values['/disabled'],
          },
        ];

        if (flow.disabled !== values['/disabled']) {
          yield put(actions.resource.patchStaged(flowId, patchSet, 'value'));

          yield put(actions.resource.commitStaged('flows', flowId, 'value'));
        }
      }
    } else {
      // When a staticMapWidget is saved, the map object from field will be saved to one/many mappings as static-lookup mapping.
      // Hence we need to refresh imports and mappings to reflect the changes
      yield put(actions.resource.requestCollection('imports', null, true));
      // Salesforce IA modifies exports when relatedlists, referenced fields are saved. CAM modifies exports based on flow settings.
      yield put(actions.resource.requestCollection('exports', null, true));
    }

    yield put(
      actions.integrationApp.settings.submitComplete({
        childId,
        integrationId,
        response,
        flowId,
        sectionId,
      })
    );
  }

  if (options.action === 'flowEnableDisable') {
    yield put(actions.flow.isOnOffActionInprogress(false, flowId));
  }
}

export function* patchResource({ resourceType, id, patchSet, options = {}, asyncKey }) {
  const isNew = isNewId(id);

  if (!patchSet || isNew) return; // nothing to do.

  const path = `/${resourceType}/${id}`;

  yield put(actions.asyncTask.start(asyncKey));
  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PATCH',
        body: patchSet,
      },
    });

    if (!options.doNotRefetch) {
      const resource = yield select(selectors.resource, resourceType, id);

      // applyPatch is not able to update the object as per patchSet as resource is
      // selector's result and is not mutatable. Therefore deepcloning resource in args.
      const resourceUpdated = jsonPatch.applyPatch(deepClone(resource), patchSet).newDocument;

      yield put(actions.resource.received(resourceType, resourceUpdated));
    } else {
      yield put(actions.resource.request('integrations', id));
    }
  } catch (error) {
    // TODO: What should we do for 4xx errors? where the resource to put/post
    // violates some API business rules?
    yield put(actions.asyncTask.failed(asyncKey));
  }
  yield put(actions.asyncTask.success(asyncKey));
}

export function* requestReferences({ resourceType, id, skipSave = false, options = {} }) {
  const path = `/${resourceType}/${id}/dependencies`;

  try {
    const resourceReferences = yield call(apiCallWithRetry, {
      path,
      hidden: !!options.ignoreError,
    });

    if (!skipSave) yield put(actions.resource.receivedReferences(resourceReferences));

    return resourceReferences;
  } catch (error) {
    return undefined;
  }
}

export function* deleteResource({ resourceType, id }) {
  const path = `/${resourceType}/${id}`;

  try {
    if (
      resourceType.indexOf('/licenses') === -1 &&
      resourceType.indexOf('transfers') === -1
    ) {
      const resourceReferences = yield call(requestReferences, {
        resourceType,
        id,
      });

      if (resourceReferences && Object.keys(resourceReferences).length > 0) {
        return;
      }
    }

    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: `Deleting ${resourceType}`,
    });

    yield put(actions.resource.deleted(resourceType, id));
  } catch (error) {
    return undefined;
  }
}

export function* deleteIntegration({ integrationId }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);

  if (integration?._connectorId) return;

  yield call(deleteResource, { resourceType: 'integrations', id: integrationId });

  yield put(actions.resource.requestCollection('integrations', null, true));
  yield put(actions.resource.requestCollection('tiles', null, true));
  yield put(actions.resource.requestCollection('scripts', null, true));
  yield put(actions.resource.integrations.redirectTo(integrationId, HOME_PAGE_PATH));
}

export function* getResourceCollection({ resourceType, refresh }) {
  let path = `/${resourceType}`;
  let hideNetWorkSnackbar;

  /** hide the error that GET SuiteScript tiles throws when connection is offline */
  /** hide transfers API call as it throws error when account user accepts first account and
   *  logs in with SSO for the very first time when his preferences still hold defaultAshareId as 'own'
   */
  if (
    resourceType &&
    ((resourceType.includes('suitescript/connections/') && resourceType.includes('/tiles')) ||
    resourceType.includes('ashares') ||
    resourceType.includes('transfers'))
  ) {
    hideNetWorkSnackbar = true;
  }

  if (resourceType === 'marketplacetemplates') {
    path = '/templates/published';
  }
  if (resourceType === 'notifications') {
    path = '/notifications?users=all';
  }

  try {
    let collection = yield call(apiCallWithRetry, {
      path,
      hidden: hideNetWorkSnackbar,
      refresh,
    });

    console.log('check ', path, collection);
    if (resourceType === 'stacks') {
      let sharedStacks = yield call(apiCallWithRetry, {
        path: '/shared/stacks',
        refresh,
      });

      sharedStacks = sharedStacks.map(stack => ({ ...stack, shared: true }));

      if (!collection) collection = sharedStacks;
      else collection = [...collection, ...sharedStacks];
    }

    if (resourceType === 'transfers') {
      const invitedTransfers = yield call(apiCallWithRetry, {
        path: '/transfers/invited',
        refresh,
      });

      if (!collection) collection = invitedTransfers;
      else if (invitedTransfers) collection = [...collection, ...invitedTransfers];
    }

    if (collection !== undefined && !Array.isArray(collection) && !NON_ARRAY_RESOURCE_TYPES.includes(resourceType)) {
      // eslint-disable-next-line no-console
      console.warn('Getting unexpected collection values: ', collection);
      collection = undefined;
    }

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it

  }
}

export function* validateResource({ resourceType, resourceId }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!isEmpty(resource) || !resourceType || !resourceId) return;

  return yield call(getResource, { resourceType, id: resourceId, hidden: true });
}

export function* updateTileNotifications({ resourcesToUpdate, integrationId, childId, userEmail, asyncKey }) {
  const { subscribedConnections = [], subscribedFlows = [] } = resourcesToUpdate;

  yield put(actions.asyncTask.start(asyncKey));
  const {
    flows: availableFlows = [],
    connections: availableConnections = [],
  } = yield select(selectors.integrationNotificationResources, integrationId, { childId, userEmail });
  const notifications = [];

  notifications.push({
    _integrationId: integrationId,
    subscribed: subscribedFlows.includes(integrationId),
    ...(userEmail ? { subscribedByUserEmail: userEmail } : {}),
  });

  availableFlows
    .filter(f => f._id !== integrationId)
    .forEach(flow => {
      notifications.push({
        _flowId: flow._id,
        subscribed: subscribedFlows.includes(flow._id),
        ...(userEmail ? { subscribedByUserEmail: userEmail } : {}),
      });
    });
  availableConnections.forEach(connection => {
    notifications.push({
      _connectionId: connection._id,
      subscribed: subscribedConnections.includes(connection._id),
      ...(userEmail ? { subscribedByUserEmail: userEmail } : {}),
    });
  });
  let response;
  const path = '/notifications';

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: notifications,
        method: 'put',
      },
      message: 'Updating notifications',
    });
  } catch (e) {
    yield put(actions.asyncTask.failed(asyncKey));

    return;
  }

  if (response) {
    yield put(actions.resource.requestCollection('notifications'));
  }
  yield put(actions.asyncTask.success(asyncKey));
}

export function* updateFlowNotification({ flowId, isSubscribed }) {
  const flow = yield select(selectors.resource, 'flows', flowId);
  const integrationId = flow?._integrationId || 'none';
  const { flowValues: subscribedFlows = [] } = yield select(selectors.integrationNotificationResources, integrationId);
  const isAllFlowsSelectedPreviously = subscribedFlows.find(id => id === integrationId);
  const notifications = [];
  let response;

  if (isAllFlowsSelectedPreviously) {
    if (isSubscribed) {
      return;
    }
    notifications.push({
      _integrationId: integrationId,
      subscribed: false,
    });
    subscribedFlows
      .filter(f => f._id !== integrationId && f !== integrationId)
      .forEach(flow => {
        notifications.push({
          _flowId: flow._id,
          subscribed: flow._id !== flowId,
        });
      });
  } else {
    notifications.push(
      {
        _integrationId: integrationId,
        subscribed: false,
      }, {
        _flowId: flow._id,
        subscribed: isSubscribed,
      },
    );
  }
  try {
    response = yield call(apiCallWithRetry, {
      path: '/notifications',
      opts: {
        body: notifications,
        method: 'put',
      },
      message: 'Updating notifications',
    });
  } catch (e) {
    return;
  }

  if (response) {
    yield put(actions.resource.requestCollection('notifications'));
  }
}

export function* requestRegister({ connectionIds, integrationId }) {
  const path = `/integrations/${integrationId}/connections/register`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: connectionIds,
      },
      message: 'Registering connections',
    });

    yield put(
      actions.connection.completeRegister(connectionIds, integrationId)
    );
  } catch (error) {
    return undefined;
  }
}

export function* requestDeregister({ connectionId, integrationId }) {
  const path = `/integrations/${integrationId}/connections/${connectionId}/register`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: 'Deregistering connection',
    });

    yield put(
      actions.connection.completeDeregister(connectionId, integrationId)
    );
  } catch (error) {
    return undefined;
  }
}

export function* updateTradingPartner({ connectionId }) {
  const path = `/connections/${connectionId}/tradingPartner`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
      },
      message: 'Updating trading partner',
    });

    yield put(
      actions.connection.completeTradingPartner(response?._connectionIds || [])
    );
  } catch (error) {
    return undefined;
  }
}

export function* fetchUnloadedResources({ integrationId, resourceType }) {
  let resources = yield select(selectors.resources, resourceType);

  if (!resources || resources.length === 0) {
    yield call(getResourceCollection, { resourceType, refresh: true });
    resources = yield select(selectors.resources, resourceType);
  }
  if (!integrationId || !resources || resources.length < GET_DOCS_MAX_LIMIT) {
    return;
  }
  const url = `/integrations/${integrationId}/${resourceType}`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: url,
      hidden: true,
    });
    yield put(actions.resource.integrations.updateResources(resourceType, response));
  } catch (e) {
  // do nothing
  }
}

export function* fetchUnloadedIntegrationResources({ integrationId }) {
  yield all(
    ['flows', 'exports', 'imports', 'connections'].map(resourceType => call(fetchUnloadedResources, { integrationId, resourceType }))
  );
}

export function* receivedResource({ resourceType, resource }) {
  if (resourceType === 'connections' && resource && !resource.offline) {
    yield put(actions.connection.madeOnline(resource._id));
  }
}

export function* authorizedConnection({ connectionId }) {
  yield put(actions.connection.madeOnline(connectionId));
  const { merged: connectionResource } = yield select(
    selectors.resourceData,
    'connections',
    connectionId
  );
  const isOauthOfflineResource = [connectionResource?.http?.auth?.type, connectionResource?.rest?.authType].includes('oauth') && !!(connectionResource?.offline);

  if (
    connectionResource &&
    (connectionResource.type === 'netsuite' ||
      connectionResource.type === 'salesforce' || isOauthOfflineResource)
  ) {
    yield put(actions.resource.request('connections', connectionId));
  }
}

export function* refreshConnectionStatus({ integrationId }) {
  const url = integrationId
    ? `/integrations/${integrationId}/connections?fetchQueueSize=true`
    : '/connections?fetchQueueSize=true';
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: url,
      hidden: true,
    });
    yield put(actions.resource.connections.updateStatus(response));
  } catch (e) {
    // do nothing
  }
}

export function* requestQueuedJobs({ connectionId }) {
  const path = `/connections/${connectionId}/jobs`;
  let response;

  try {
    response = yield call(apiCallWithRetry, { path });
  } catch (error) {
    return;
  }

  yield put(actions.connection.receivedQueuedJobs(response, connectionId));
}

function* startPollingForQueuedJobs({ connectionId }) {
  const watcher = yield fork(requestQueuedJobs, { connectionId });

  yield take(actionTypes.CONNECTION.QUEUED_JOBS_CANCEL_POLL);
  yield cancel(watcher);
}

function* startPollingForConnectionStatus({ integrationId }) {
  const watcher = yield fork(refreshConnectionStatus, { integrationId });

  yield take(actionTypes.CONNECTION.STATUS_CANCEL_POLL);
  yield cancel(watcher);
}

export function* cancelQueuedJob({ jobId }) {
  const path = `/jobs/${jobId}/cancel`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {},
        method: 'PUT',
      },
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error?.message, false));
  }
}
export function* replaceConnection({ _resourceId, _connectionId, _newConnectionId }) {
  const path = `/flows/${_resourceId}/replaceConnection`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { _connectionId, _newConnectionId },
        method: 'PUT',
      },
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error?.message, false));

    return;
  }
  yield put(actions.resource.requestCollection('flows', null, true));
  yield put(actions.resource.requestCollection('exports', null, true));
  yield put(actions.resource.requestCollection('imports', null, true));
}

export function* eventReportCancel({ reportId }) {
  const path = `/eventreports/${reportId}/cancel`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.resource.request('eventreports', reportId));
}

export function* downloadReport({ reportId }) {
  const path = `/eventreports/${reportId}/signedURL`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
    });

    window.open(response.signedURL, 'target=_blank', 'noopener,noreferrer');
  // eslint-disable-next-line no-empty
  } catch (e) {

  }
}

export function* pollForResourceCollection({ resourceType }) {
  yield call(pollApiRequests, {pollSaga: getResourceCollection, pollSagaArgs: {resourceType}, duration: STANDARD_DELAY_FOR_POLLING });
}
export function* startPollingForResourceCollection({ resourceType }) {
  return yield race({
    pollCollection: call(pollForResourceCollection, { resourceType }),
    cancelPoll: take(action => {
      if ([
        actionTypes.RESOURCE.STOP_COLLECTION_POLL,
        actionTypes.RESOURCE.START_COLLECTION_POLL,
      ].includes(action.type) &&
    action.resourceType === resourceType) {
        return true;
      }
    }),
  });
}
export const resourceSagas = [
  takeEvery(actionTypes.EVENT_REPORT.CANCEL, eventReportCancel),
  takeEvery(actionTypes.EVENT_REPORT.DOWNLOAD, downloadReport),
  takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
  takeEvery(
    actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE,
    updateIntegrationSettings
  ),
  takeEvery(actionTypes.RESOURCE.PATCH, patchResource),
  takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
  takeEvery(actionTypes.RESOURCE.VALIDATE_RESOURCE, validateResource),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChangesWrapper),
  takeEvery(actionTypes.RESOURCE.DELETE, deleteResource),
  takeEvery(actionTypes.RESOURCE.REFERENCES_REQUEST, requestReferences),
  takeEvery(actionTypes.RESOURCE.DOWNLOAD_FILE, downloadFile),
  takeEvery(actionTypes.CONNECTION.REGISTER_REQUEST, requestRegister),
  takeEvery(actionTypes.CONNECTION.REFRESH_STATUS, refreshConnectionStatus),
  takeEvery(actionTypes.RESOURCE.UPDATE_TILE_NOTIFICATIONS, updateTileNotifications),
  takeEvery(actionTypes.RESOURCE.UPDATE_FLOW_NOTIFICATION, updateFlowNotification),
  takeEvery(actionTypes.CONNECTION.DEREGISTER_REQUEST, requestDeregister),
  takeEvery(actionTypes.CONNECTION.TRADING_PARTNER_UPDATE, updateTradingPartner),
  takeLatest(actionTypes.INTEGRATION.FETCH_UNLOADED_FLOWS, fetchUnloadedIntegrationResources),
  takeEvery(actionTypes.RESOURCE.RECEIVED, receivedResource),
  takeEvery(actionTypes.CONNECTION.AUTHORIZED, authorizedConnection),
  takeEvery(actionTypes.CONNECTION.REVOKE_REQUEST, requestRevoke),
  takeLatest(actionTypes.CONNECTION.QUEUED_JOBS_REQUEST_POLL, startPollingForQueuedJobs),
  takeLatest(actionTypes.CONNECTION.STATUS_REQUEST_POLL, startPollingForConnectionStatus),
  takeEvery(actionTypes.CONNECTION.QUEUED_JOBS_REQUEST, requestQueuedJobs),
  takeEvery(actionTypes.CONNECTION.QUEUED_JOB_CANCEL, cancelQueuedJob),
  takeEvery(actionTypes.SUITESCRIPT.CONNECTION.LINK_INTEGRATOR, linkUnlinkSuiteScriptIntegrator),
  takeEvery(actionTypes.RESOURCE.REPLACE_CONNECTION, replaceConnection),
  takeEvery(actionTypes.RESOURCE.START_COLLECTION_POLL, startPollingForResourceCollection),
  takeLatest(actionTypes.INTEGRATION.DELETE, deleteIntegration),

  ...metadataSagas,
];
