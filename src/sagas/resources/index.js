import { call, put, takeEvery, select } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import { isEqual } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import util from '../../utils/array';
import { isNewId } from '../../utils/resource';
import metadataSagas from './meta';
import getRequestOptions from '../../utils/requestOptions';
import { defaultPatchSetConverter } from '../../forms/utils';
import conversionUtil from '../../utils/httpToRestConnectionConversionUtil';
import { REST_ASSISTANTS } from '../../utils/constants';

function* isDataLoaderFlow(flow) {
  if (!flow) return false;

  // assume old DL interface
  let exportId = flow._exportId;

  // override if new interface present.
  if (flow.pageGenerators && flow.pageGenerators.length > 0) {
    exportId = flow.pageGenerators[0]._exportId;
  }

  if (!exportId) return false;

  // we have a flow with an export. Is this export a data loader? (type=simple)
  const data = yield select(selectors.resourceData, 'exports', exportId);
  const exp = data.merged;

  if (exp && exp.type === 'simple') {
    // console.log('we have a data loader flow!');

    return true;
  }
}

export function* commitStagedChanges({ resourceType, id, scope }) {
  const userPreferences = yield select(selectors.userPreferences);
  const isSandbox = userPreferences
    ? userPreferences.environment === 'sandbox'
    : false;
  const data = yield select(selectors.resourceData, resourceType, id, scope);
  const { patch, master } = data;
  let { merged } = data;
  const isNew = isNewId(id);

  // console.log('commitStaged saga', resourceType, id, patch, merged, master);

  if (!patch) return; // nothing to do.

  // For accesstokens and connections within an integration for edit case
  if (!isNew && resourceType.indexOf('integrations/') >= 0) {
    // eslint-disable-next-line no-param-reassign
    resourceType = resourceType.split('/').pop();
  }

  // #region Temp Data loader code
  // For consistency, we normalize the client code to use the new pageProcessor and pageGenerator fields
  // in favor of the old _exportId and _importId fields.  The Data loader (export type = simple) flows
  // only support the older interface, so we need to convert back before we make the PUT/POST API call.
  // this complete code block can be removed once the BE DL code uses the new flow interface fields.
  let resourceIsDataLoaderFlow = false;

  if (resourceType === 'flows') {
    resourceIsDataLoaderFlow = yield call(isDataLoaderFlow, merged);

    if (resourceIsDataLoaderFlow) {
      merged._exportId = merged.pageGenerators[0]._exportId;
      delete merged.pageGenerators;

      if (merged.pageProcessors && merged.pageProcessors.length > 0) {
        const importId = merged.pageProcessors[0]._importId;

        if (importId) {
          merged._importId = importId;
          delete merged.pageProcessors;
        }
      }
    }
  }
  // #endregion

  const path = isNew ? `/${resourceType}` : `/${resourceType}/${id}`;

  // only updates need to check for conflicts.
  if (!isNew) {
    let origin;

    try {
      origin = yield call(apiCallWithRetry, { path });
    } catch (error) {
      return { error };
    }

    if (origin.lastModified !== master.lastModified) {
      let conflict = jsonPatch.compare(master, origin);

      conflict = util.removeItem(conflict, p => p.path === '/lastModified');

      yield put(actions.resource.commitConflict(id, conflict, scope));
      yield put(actions.resource.received(resourceType, origin));

      return;
    }
  } else if (
    ['exports', 'imports', 'connections', 'flows', 'integrations'].includes(
      resourceType
    )
  ) {
    merged.sandbox = isSandbox;
  }

  let updated;

  // We built all connection assistants on HTTP adaptor on React. With recent changes to decouple REST deprecation
  // and React we are forced to convert HTTP to REST doc for existing REST assistants since we don't want to build
  // 150 odd connection assistants again. Once React becomes the only app and when assistants are migrated we would
  // remove this code and let all docs be built on HTTP adaptor.
  if (
    resourceType === 'connections' &&
    merged.assistant &&
    REST_ASSISTANTS.indexOf(merged.assistant) > -1
  ) {
    merged = conversionUtil.convertConnJSONObjHTTPtoREST(merged);
  }

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
    return { error };
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

  /*
     connections can be saved with valid or invalid credentials(i.e whether ping succeeded or failed) 
     calling ping after connection save sets the offline flag appropriately in the backend.
     UI shouldnt set offline flag. It should read status from db.
  */
  if (resourceType === 'connections' && updated._id && isNew) {
    try {
      yield call(apiCallWithRetry, {
        path: `/connections/${updated._id}/ping`,
        hidden: true,
      });
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

  yield put(actions.resource.received(resourceType, updated));

  if (!isNew) {
    yield put(
      actions.resource.updated(resourceType, updated._id, master, patch)
    );
  }

  yield put(actions.resource.clearStaged(id, scope));

  if (isNew) {
    yield put(actions.resource.created(updated._id, id, resourceType));
  }
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

export function* updateIntegrationSettings({
  storeId,
  integrationId,
  values,
  flowId,
  sectionId,
  options = {},
}) {
  const path = `/integrations/${integrationId}/settings/persistSettings`;
  let payload = jsonPatch.applyPatch({}, defaultPatchSetConverter(values))
    .newDocument;

  if (storeId) {
    payload = { [storeId]: payload };
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
    return yield put(
      actions.integrationApp.settings.submitFailed({
        storeId,
        integrationId,
        response,
        flowId,
        sectionId,
      })
    );
  }

  if (response) {
    yield put(
      actions.integrationApp.settings.submitComplete({
        storeId,
        integrationId,
        response,
        flowId,
        sectionId,
      })
    );
    // integration doc will be update by IA team, need to refetch to get latest copy from db.
    yield put(actions.resource.request('integrations', integrationId));

    // When a staticMapWidget is saved, the map object from field will be saved to one/many mappings as static-lookup mapping.
    // Hence we need to refresh imports and mappings to reflect the changes
    yield put(actions.resource.requestCollection('imports'));

    // If settings object is sent to response, we need to refetch resources as they are modified by IA
    if (response.settings) {
      yield put(actions.resource.requestCollection('exports'));
      yield put(actions.resource.requestCollection('flows'));
    }

    if (response._flowId) {
      // when Save button on section triggers a flow on integrationApp, it will send back _flowId in the response.
      // UI should navigate to dashboard so that user can the see the flow status.
      yield put(
        actions.integrationApp.settings.redirectTo(integrationId, 'dashboard')
      );
    }

    // If persistSettings is called for IA flow enable/disable
    if (options.action === 'flowEnableDisable') {
      const flowDetails = yield select(selectors.resource, 'flows', flowId);
      const patchSet = [
        {
          op: 'replace',
          path: '/disabled',
          // IA sends back pending object containing flow state, patch that state to data store
          value: response.pending
            ? response.pending.disabled
            : !flowDetails.disabled,
        },
      ];

      // Regardless of success or failure update the data store to latest value.
      yield put(actions.resource.patchStaged(flowId, patchSet, 'value'));

      // If the action is successful, update the flow status in db.
      if (response.success) {
        yield put(actions.resource.commitStaged('flows', flowId, 'value'));
      }
    }
  }
}

export function* patchResource({ resourceType, id, patchSet, options = {} }) {
  const isNew = isNewId(id);

  if (!patchSet || isNew) return; // nothing to do.

  const path = `/${resourceType}/${id}`;

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
      const resourceUpdated = jsonPatch.applyPatch(resource, patchSet)
        .newDocument;

      yield put(actions.resource.received(resourceType, resourceUpdated));
    } else {
      yield put(actions.resource.request('integrations', id));
    }
  } catch (error) {
    // TODO: What should we do for 4xx errors? where the resource to put/post
    // violates some API business rules?
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

export function* getResource({ resourceType, id, message }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
    let resource = yield call(apiCallWithRetry, { path, message });

    if (resourceType === 'flows') {
      resource = yield call(normalizeFlow, resource);
    }

    yield put(actions.resource.received(resourceType, resource));

    return resource;
  } catch (error) {
    return undefined;
  }
}

export function* requestReferences({ resourceType, id }) {
  const path = `/${resourceType}/${id}/dependencies`;

  try {
    const resourceReferences = yield call(apiCallWithRetry, { path });

    yield put(actions.resource.receivedReferences(resourceReferences));

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

export function* getResourceCollection({ resourceType }) {
  const path = `/${resourceType}`;
  let hideNetWorkSnackbar = false;

  /** hide the error that GET SuiteScript tiles throws when connection is offline */
  if (
    resourceType &&
    resourceType.includes('suitescript/connections/') &&
    resourceType.includes('/tiles')
  ) {
    hideNetWorkSnackbar = true;
  }

  try {
    let collection = yield call(apiCallWithRetry, {
      path,
      hidden: hideNetWorkSnackbar,
    });

    if (resourceType === 'stacks') {
      let sharedStacks = yield call(apiCallWithRetry, {
        path: '/shared/stacks',
      });

      sharedStacks = sharedStacks.map(stack => ({ ...stack, shared: true }));

      if (!collection) collection = sharedStacks;
      else collection = [...collection, ...sharedStacks];
    }

    if (resourceType === 'transfers') {
      const invitedTransfers = yield call(apiCallWithRetry, {
        path: '/transfers/invited',
      });

      if (!collection) collection = invitedTransfers;
      else collection = [...collection, ...invitedTransfers];
    }

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export function* updateNotifications({ notifications }) {
  let response;
  const path = '/notifications';

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: notifications,
        method: 'PUT',
      },
      message: 'Updating Notifications.',
    });
  } catch (e) {
    return undefined;
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
      message: `Registering Connections`,
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
      message: `Deregistering Connection`,
    });

    yield put(
      actions.connection.completeDeregister(connectionId, integrationId)
    );
  } catch (error) {
    return undefined;
  }
}

export function* requestRevoke({ connectionId }) {
  const path = `/connection/${connectionId}/revoke`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: `Revoking Connection`,
    });

    if (response && response.errors) {
      yield put(
        actions.api.failure(path, 'GET', JSON.stringify(response.errors), false)
      );
    }
  } catch (error) {
    return undefined;
  }
}

export function* requestDebugLogs({ connectionId }) {
  let response;
  const path = `/connections/${connectionId}/debug`;

  try {
    response = yield call(apiCallWithRetry, { path });
    yield put(
      actions.connection.receivedDebugLogs(
        response ||
          'There are no logs available for this connection. Please run your flow so that we can record the outgoing and incoming traffic to this connection.',
        connectionId
      )
    );
  } catch (error) {
    return undefined;
  }
}

export function* receivedResource({ resourceType, resource }) {
  if (resourceType === 'connections' && !resource.offline) {
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

  if (connectionResource && connectionResource.type === 'netsuite') {
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
  } catch (e) {
    return;
  }

  const finalResponse = Array.isArray(response)
    ? response.map(({ _id, offline, queues }) => ({
        _id,
        offline: !!offline,
        queueSize: queues[0].size,
      }))
    : [];

  yield put(
    actions.resource.connections.receivedConnectionStatus(finalResponse)
  );
}

export const resourceSagas = [
  takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
  takeEvery(
    actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE,
    updateIntegrationSettings
  ),
  takeEvery(actionTypes.RESOURCE.PATCH, patchResource),
  takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  takeEvery(actionTypes.RESOURCE.DELETE, deleteResource),
  takeEvery(actionTypes.RESOURCE.REFERENCES_REQUEST, requestReferences),
  takeEvery(actionTypes.RESOURCE.DOWNLOAD_FILE, downloadFile),
  takeEvery(actionTypes.CONNECTION.REGISTER_REQUEST, requestRegister),
  takeEvery(actionTypes.CONNECTION.REFRESH_STATUS, refreshConnectionStatus),
  takeEvery(actionTypes.RESOURCE.UPDATE_NOTIFICATIONS, updateNotifications),
  takeEvery(actionTypes.CONNECTION.DEREGISTER_REQUEST, requestDeregister),
  takeEvery(actionTypes.CONNECTION.DEBUG_LOGS_REQUEST, requestDebugLogs),
  takeEvery(actionTypes.RESOURCE.RECEIVED, receivedResource),
  takeEvery(actionTypes.CONNECTION.AUTHORIZED, authorizedConnection),
  takeEvery(actionTypes.CONNECTION.REVOKE_REQUEST, requestRevoke),

  ...metadataSagas,
];
