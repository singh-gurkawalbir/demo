import { call, put, takeEvery, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import { isConnector } from '../../../utils/flows';

export function* commitStagedChanges({
  resourceType,
  id,
  scope,
  options,
  ssLinkedConnectionId,
  integrationId,
}) {
  const data = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id,
    scope,
    ssLinkedConnectionId,
    integrationId,
  });
  const { patch, master } = data;
  const { merged } = data;
  const isNew = isNewId(id);

  // console.log('commitStaged saga', resourceType, id, patch, merged, master);

  if (!patch) return; // nothing to do.

  let resourceId = resourceType === 'connections' ? merged.id : id;
  let resourceTypeToUse = resourceType;

  if (['exports', 'imports'].includes(resourceTypeToUse)) {
    resourceTypeToUse = 'flows';
    resourceId = resourceId
      .replace('re', '')
      .replace('ri', '')
      .replace('e', '')
      .replace('i', '');
  }

  let path = `/suitescript/connections/${ssLinkedConnectionId}/`;

  if (!['connections', 'integrations'].includes(resourceTypeToUse)) {
    path += `integrations/${integrationId}/`;
  }

  path += isNew ? `${resourceTypeToUse}` : `${resourceTypeToUse}/${resourceId}`;

  // only updates need to check for conflicts.
  //   if (!isNew) {
  //     const resp = yield call(resourceConflictDetermination, {
  //       path,
  //       merged,
  //       id,
  //       scope,
  //       resourceType,
  //       master,
  //     });
  //     if (resp && (resp.error || resp.conflict)) return resp;
  //     // eslint-disable-next-line prefer-destructuring
  //     merged = resp.merged;
  //   }

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

  yield put(
    actions.suiteScript.resource.received(
      resourceType,
      updated,
      ssLinkedConnectionId,
      integrationId
    )
  );

  if (!isNew) {
    yield put(
      actions.suiteScript.resource.updated(
        resourceType,
        updated._id,
        master,
        patch,
        ssLinkedConnectionId,
        integrationId
      )
    );
  }

  if (options && options.action === 'flowEnableDisable') {
    yield put(actions.flow.isOnOffActionInprogress(false, id));
  }

  yield put(
    actions.suiteScript.resource.clearStaged(
      id,
      scope,
      ssLinkedConnectionId,
      integrationId,
      resourceType
    )
  );

  if (isNew) {
    yield put(actions.resource.created(updated._id, id, resourceType));
  }
}

export const resourceSagas = [
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
];
