import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';

export function* requestPreview({ resourceType, resourceId }) {
  const path = `/${resourceType}/${resourceId}/clone/preview`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      message: `Fetching Preview`,
    });
  } catch (error) {
    yield put(actions.clone.failedPreview(resourceType, resourceId));

    return undefined;
  }

  yield put(
    actions.clone.receivedPreview(components, resourceType, resourceId)
  );
}

export function* createComponents({ resourceType, resourceId }) {
  const { cMap: connectionMap, stackId: _stackId, data = {} } = yield select(
    selectors.cloneData,
    resourceType,
    resourceId
  );
  const path = `/${resourceType}/${resourceId}/clone`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: {
          connectionMap,
          _stackId,
          sandbox: data.sandbox,
          name: data.name,
          _integrationId: data._integrationId,
        },
      },
      message: `Cloning...`,
    });
  } catch (error) {
    yield put(actions.clone.failedInstall(resourceType, resourceId));

    return undefined;
  }

  yield put(
    actions.clone.createdComponents(components, resourceType, resourceId)
  );
}

export function* verifyBundleOrPackageInstall({
  step,
  connection,
  resourceType,
  resourceId,
}) {
  const path = `/connections/${connection._id}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: `Verifying Bundle/Package Installation...`,
    });
  } catch (error) {
    yield put(
      actions.clone.updateStep(
        { status: 'failed', installURL: step.installURL },
        resourceType,
        resourceId
      )
    );

    return undefined;
  }

  if ((response || {}).success) {
    yield put(
      actions.clone.updateStep(
        { status: 'completed', installURL: step.installURL },
        resourceType,
        resourceId
      )
    );
  } else {
    yield put(
      actions.clone.updateStep(
        { status: 'failed', installURL: step.installURL },
        resourceType,
        resourceId
      )
    );
  }
}

export const cloneSagas = [
  takeEvery(actionTypes.CLONE.PREVIEW_REQUEST, requestPreview),
  takeEvery(
    actionTypes.CLONE.VERIFY_BUNDLE_INSTALL,
    verifyBundleOrPackageInstall
  ),
  takeEvery(actionTypes.CLONE.CREATE_COMPONENTS, createComponents),
];
