import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import * as selectors from '../../../reducers';
import { getFlowIdAndTypeFromUniqueId } from '../../../utils/suiteScript';

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

  if (!patch) return; // nothing to do.

  let resourceId = resourceType === 'connections' ? merged.id : id;
  let resourceTypeToUse = resourceType;

  if (['exports', 'imports'].includes(resourceTypeToUse)) {
    resourceTypeToUse = 'flows';
  }

  if (resourceTypeToUse === 'flows') {
    resourceId = getFlowIdAndTypeFromUniqueId(resourceId).flowId;
  }

  let path = `/suitescript/connections/${ssLinkedConnectionId}/`;

  if (
    !['connections', 'integrations', 'refreshlegacycontrolpanel'].includes(
      resourceTypeToUse
    )
  ) {
    path += `integrations/${integrationId}/`;
  }

  path +=
    resourceTypeToUse === 'refreshlegacycontrolpanel'
      ? `${resourceTypeToUse}`
      : `${resourceTypeToUse}/${resourceId}`;

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
  let updated;

  try {
    updated = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
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
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      updated,
    )
  );

  yield put(
    actions.suiteScript.resource.updated(
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      updated._id,
      master,
      patch,
    )
  );

  if (options && options.action === 'flowEnableDisable') {
    yield put(actions.flow.isOnOffActionInprogress(false, id));
  }

  yield put(
    actions.suiteScript.resource.clearStaged(
      ssLinkedConnectionId,
      resourceType,
      id,
      scope,
    )
  );
}


function* requestSuiteScriptMetadata({
  resourceType,
  ssLinkedConnectionId,
  integrationId,
}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/${resourceType}`;
  const opts = {method: 'GET'};

  try {
    const resource = yield call(apiCallWithRetry, {path, opts});
    yield put(actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, resourceType, resource));
  } catch (error) {
    return true;
  }
}

function* featureCheck({
  ssLinkedConnectionId,
  integrationId,
  featureName,
}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/featureCheck?featureCheckConfig={"featureName":"${featureName}"}`;
  const opts = {method: 'GET'};

  let resp;
  try {
    resp = yield call(apiCallWithRetry, {path, opts});
    if (resp.success) {
      yield put(actions.suiteScript.featureCheck.successful(ssLinkedConnectionId,
        integrationId,
        featureName));
    }
  // eslint-disable-next-line no-empty
  } catch (error) {
  }

  yield put(actions.suiteScript.featureCheck.failed(ssLinkedConnectionId,
    integrationId,
    featureName, (resp && resp.errors && resp.errors.length && resp.errors[0].message) || 'Error'));
}


export const resourceSagas = [
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE.REQUEST, requestSuiteScriptMetadata),
  takeEvery(actionTypes.SUITESCRIPT.FEATURE_CHECK.REQUEST, featureCheck),
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE.STAGE_COMMIT, commitStagedChanges),
];
