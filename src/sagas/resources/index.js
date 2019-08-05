import { call, put, takeEvery, select } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import util from '../../utils/array';
import metadataSagas from './meta';

export function* commitStagedChanges({ resourceType, id }) {
  const { patch, merged, master } = yield select(
    selectors.resourceData,
    resourceType,
    id
  );

  // console.log(merged, master);

  if (!patch) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const origin = yield call(apiCallWithRetry, { path });

  if (origin.lastModified !== master.lastModified) {
    let conflict = jsonPatch.compare(master, origin);

    conflict = util.removeItem(conflict, p => p.path === '/lastModified');

    yield put(actions.resource.commitConflict(id, conflict));
    yield put(actions.resource.received(resourceType, origin));

    return;
  }

  try {
    const updated = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: merged,
      },
    });

    // HACK! when updating scripts, since content is stored in s3, it
    // seems the PUT API response does not contain the content.
    if (merged.content && updated.content === undefined) {
      updated.content = merged.content;
    }

    yield put(actions.resource.received(resourceType, updated));

    yield put(actions.resource.clearStaged(id));
  } catch (error) {
    // Dave would handle this part
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

export function* deleteResource({ resourceType, id }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
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
    const collection = yield call(apiCallWithRetry, { path });

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export function* fetchResourceReferences({ resourceType, id }) {
  const path = id
    ? `/${resourceType}/${id}/dependencies`
    : `/${resourceType}/dependencies`;

  try {
    const resourceReferences = yield call(apiCallWithRetry, { path });

    yield put(
      actions.resource.receivedResourceReferences(
        resourceType,
        id,
        resourceReferences
      )
    );

    return resourceReferences;
  } catch (error) {
    return undefined;
  }
}

export const resourceSagas = [
  takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
  takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  takeEvery(actionTypes.RESOURCE.DELETE, deleteResource),
  takeEvery(
    actionTypes.RESOURCE.FETCH_RESOURCE_REFERENCES,
    fetchResourceReferences
  ),
  ...metadataSagas,
];
