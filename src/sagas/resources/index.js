import { call, put, takeEvery, select } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import util from '../../utils/array';
import { isNewId } from '../../utils/resource';
import metadataSagas from './meta';

export function* commitStagedChanges({ resourceType, id, scope }) {
  const { patch, merged, master } = yield select(
    selectors.resourceData,
    resourceType,
    id,
    scope
  );
  const isNew = isNewId(id);

  // console.log('commitStaged saga', resourceType, id, patch, merged, master);

  if (!patch) return; // nothing to do.

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
  }

  try {
    const updated = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: isNew ? 'post' : 'put',
        body: merged,
      },
    });

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

    yield put(actions.resource.received(resourceType, updated));
    yield put(actions.resource.clearStaged(id, scope));

    if (isNew) {
      yield put(actions.resource.created(updated._id, id));
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
    const resourceReferences = yield call(requestReferences, {
      resourceType,
      id,
    });

    if (resourceReferences && Object.keys(resourceReferences).length > 0) {
      return;
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

export const resourceSagas = [
  takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
  takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  takeEvery(actionTypes.RESOURCE.DELETE, deleteResource),
  takeEvery(actionTypes.RESOURCE.REFERENCES_REQUEST, requestReferences),
  ...metadataSagas,
];
