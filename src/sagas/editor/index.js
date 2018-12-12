import jsonPatch from 'fast-json-patch';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import util from '../../utils/array';
import { apiCallWithRetry } from '../index';

export function* commitStagedChanges({ resourceType, id }) {
  const { patch, merged, master } = yield select(
    selectors.resourceData,
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

export const editorSagas = [
  takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
];
