import { call, put, takeEvery, select, race, take } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import * as selectors from '../../../reducers/index';

function* createPayload({ formFieldValues, resourceType, resourceId }) {
  const patchOperations = Object.keys(formFieldValues).map(key => ({
    op: 'add',
    path: key,
    value: formFieldValues[key],
  }));
  // TODO: Select resource Data staged changes should be included
  const connectionResource = yield select(
    selectors.resource,
    resourceType,
    resourceId
  );

  return jsonpatch.applyPatch(connectionResource, patchOperations).newDocument;
}

function* pingConnection({ connection, resourceType, resourceId }) {
  try {
    const connectionPayload = yield call(createPayload, {
      formFieldValues: connection,
      resourceType,
      resourceId,
    });
    const { apiResp } = yield race({
      apiResp: call(apiCallWithRetry, {
        path: pingConnectionParams.path,
        opts: { body: connectionPayload, ...pingConnectionParams.opts },
        hidden: true,
      }),
      cancelTask: take(actionTypes.CANCEL_TASK),
    });

    // if the api call raced successfully without errors
    if (apiResp) {
      yield put(
        actions.api.complete(
          pingConnectionParams.path,
          'Connection is working fine!'
        )
      );
    }
  } catch (e) {
    // The ping test gives back a 200 response if the ping connection has failed
    if (e.status === 200) {
      // these errors are json errors
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      yield put(
        actions.api.failure(pingConnectionParams.path, errors[0].message)
      );
    }
  }
}

export default [takeEvery(actionTypes.TEST_CONNECTION, pingConnection)];
