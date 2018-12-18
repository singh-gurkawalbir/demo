import { call, put, select, takeEvery } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import util from '../../utils/array';

const resourceData = state => {
  selectors.resource.resourceData(state.resource);
};

export function* commitStagedChanges({ resourceType, id }) {
  const { patch, merged, master } = yield select(
    resourceData,
    resourceType,
    id
  );

  if (!patch) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const origin = yield call(apiCallWithRetry, path);

  if (origin.lastModified !== master.lastModified) {
    let conflict = jsonPatch.compare(master, origin);

    conflict = util.removeItem(conflict, p => p.path === '/lastModified');

    yield put(actions.resource.commitConflict(id, conflict));
    yield put(actions.resource.received(resourceType, origin));

    return;
  }

  try {
    const updated = yield call(apiCallWithRetry, path, {
      method: 'put',
      body: merged,
    });

    yield put(actions.resource.received(resourceType, updated));
    yield put(actions.resource.clearStaged(id));
  } catch (error) {
    // Dave would handle this part
  }
}

export function* getResource({ resourceType, id, message }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
    const resource = yield call(apiCallWithRetry, path, message);

    yield put(actions.resource.received(resourceType, resource));

    return resource;
  } catch (error) {
    return undefined;
  }
}

export function* getResourceCollection({ resourceType }) {
  const path = `/${resourceType}`;

  try {
    const collection = yield call(apiCallWithRetry, path);

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export const resourceSagas = [
  takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
  takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
];
