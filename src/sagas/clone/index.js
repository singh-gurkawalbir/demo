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
    yield put(actions.template.failedPreview(`${resourceType}-${resourceId}`));

    return undefined;
  }

  yield put(
    actions.template.receivedPreview(
      components,
      `${resourceType}-${resourceId}`
    )
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
    yield put(actions.template.failedInstall(`${resourceType}-${resourceId}`));

    return undefined;
  }

  yield put(
    actions.template.createdComponents(
      components,
      `${resourceType}-${resourceId}`
    )
  );
}

export const cloneSagas = [
  takeEvery(actionTypes.CLONE.PREVIEW_REQUEST, requestPreview),
  takeEvery(actionTypes.CLONE.CREATE_COMPONENTS, createComponents),
];
