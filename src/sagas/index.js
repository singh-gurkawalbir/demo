import {
  all,
  call,
  put,
  takeLatest,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';
import * as selectors from '../reducers';

const { profile, exports, imports, connections } = actions;
const tryCount = 3;

export function* fetchResourceCollection(action, path) {
  for (let i = 0; i < tryCount; i += 1) {
    try {
      const data = yield call(api, `/${path}`);

      return yield put(action.received(data));
    } catch (error) {
      // TODO: analyze error and dispatch(put) different actions as need.
      // for example, if we get a 401, we should dispatch a redirect action
      // to the login page. Possibly some 4xx errors could also have custom
      // behavior, etc..

      if (i < tryCount - 1) {
        yield call(delay, 2000);
        yield put(action.retry());
      } else {
        // attempts failed after 'tryCount' attempts
        // this time yield an error...
        return yield put(action.failure(error.message));
      }
    }
  }
}

export function* commitStagedChanges({ resourceType, id }) {
  const getResourceData = state => {
    const resourceData = selectors.resourceData(state, resourceType, id);

    // console.log(resourceData);

    return resourceData;
  };

  const { merged } = yield select(getResourceData);

  // if (!staged || merged === master) // retrun from saga.. nothing to do.

  /* const updated = */ yield call(api, `/${resourceType}/${id}`, {
    method: 'put',
    body: JSON.stringify(merged),
  });

  // console.log('response from put:', updated);

  // TODO: check for error response and deliver correct error message by
  // updating the comms store? somehow we need 4xx errrors that contain
  // business rule violations to show up on the edit page.

  // TODO: Replace below code with a new data reducer and action reator
  // that will replace within the data store, the single resource returned
  // from the above update call. (Instead of the brute force replace-all
  // call to the specific collection below:
  switch (resourceType) {
    case 'exports':
      yield put(actions.exports.request());
      break;
    case 'imports':
      yield put(actions.imports.request());
      break;
    case 'connections':
      yield put(actions.connections.request());
      break;
    default:
      break;
  }

  // It will take some time for the put request to be fullfilled
  // lets delasy clearing the staged data.
  yield call(delay, 200);

  yield put(actions.clearStagedResource(id));
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      actionTypes.PROFILE.REQUEST,
      fetchResourceCollection,
      profile,
      'profile'
    ),
    takeLatest(
      actionTypes.EXPORTS.REQUEST,
      fetchResourceCollection,
      exports,
      'exports'
    ),
    takeLatest(
      actionTypes.IMPORTS.REQUEST,
      fetchResourceCollection,
      imports,
      'imports'
    ),
    takeLatest(
      actionTypes.CONNECTIONS.REQUEST,
      fetchResourceCollection,
      connections,
      'connections'
    ),
    takeEvery(actionTypes.COMMIT_STAGED_RESOURCE, commitStagedChanges),
  ]);
}
