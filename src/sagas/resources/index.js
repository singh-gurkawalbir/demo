import { call, put, select, takeEvery } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import util from '../../utils/array';
import { ACCOUNT_IDS } from '../../utils/constants';

export function* getRequestOptions(path) {
  const opts = {
    headers: {},
  };
  const pathsDontNeedASharedIdHeader = [
    '/ashares',
    '/licenses',
    '/preferences',
    '/profile',
    '/published',
    '/shared/ashares',
  ];

  if (pathsDontNeedASharedIdHeader.includes(path)) {
    return opts;
  }

  const userPreferences = yield select(selectors.userPreferences);

  if (
    userPreferences &&
    userPreferences.defaultAShareId &&
    userPreferences.defaultAShareId !== ACCOUNT_IDS.OWN
  ) {
    opts.headers['integrator-ashareid'] = userPreferences.defaultAShareId;

    return opts;
  }

  return opts;
}

export function* commitStagedChanges({ resourceType, id }) {
  const { patch, merged, master } = yield select(
    selectors.resourceData,
    resourceType,
    id
  );

  // console.log(merged, master);

  if (!patch) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const opts = yield call(getRequestOptions, path);
  const origin = yield call(apiCallWithRetry, { path, opts });

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
        headers: opts.headers,
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
  const opts = yield call(getRequestOptions, path);

  try {
    const resource = yield call(apiCallWithRetry, { path, message, opts });

    yield put(actions.resource.received(resourceType, resource));

    return resource;
  } catch (error) {
    return undefined;
  }
}

export function* getResourceCollection({ resourceType }) {
  const path = `/${resourceType}`;
  const opts = yield call(getRequestOptions, path);

  try {
    const collection = yield call(apiCallWithRetry, { path, opts });

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
