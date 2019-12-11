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
import * as gainsight from '../../utils/tracking/gainsight';

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

  if (!isNew && resourceType.indexOf('/accesstokens') >= 0) {
    // eslint-disable-next-line no-param-reassign
    resourceType = 'accesstokens';
  }

  const path = isNew ? `/${resourceType}` : `/${resourceType}/${id}`;

  // only updates need to check for conflicts.
  if (!isNew) {
    const origin = yield call(apiCallWithRetry, { path });

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
  // and React we are forced to convert HTTP to REST doc for existing REST assistants since we dont want to build
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
    gainsight.trackEvent(`${resourceType.toUpperCase()}_CREATED`, {
      type: updated.type || updated.adaptorType,
      assistant: merged.assistant,
    });
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

export function* getResource({ resourceType, id, message }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
    const resource = yield call(apiCallWithRetry, { path, message });

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
    if (resourceType.indexOf('/licenses') === -1) {
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

  try {
    let collection = yield call(apiCallWithRetry, { path });

    if (resourceType === 'stacks') {
      let sharedStacks = yield call(apiCallWithRetry, {
        path: '/shared/stacks',
      });

      sharedStacks = sharedStacks.map(stack => ({ ...stack, shared: true }));
      collection = [...collection, ...sharedStacks];
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

export function* requestDebugLogs({ url, connectionId }) {
  let response;

  try {
    response = yield call(apiCallWithRetry, { path: url });
    yield put(actions.connection.receivedDebugLogs(response, connectionId));
  } catch (error) {
    if (error.status === 404) {
      response = `No Debug Logs found for the specified connectionId: ${connectionId}`;
      yield put(actions.connection.receivedDebugLogs(response, connectionId));
    }
  }
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
  takeEvery(actionTypes.RESOURCE.UPDATE_NOTIFICATIONS, updateNotifications),
  takeEvery(actionTypes.CONNECTION.DEREGISTER_REQUEST, requestDeregister),
  takeEvery(actionTypes.CONNECTION.DEBUG_LOGS_REQUEST, requestDebugLogs),
  ...metadataSagas,
];
