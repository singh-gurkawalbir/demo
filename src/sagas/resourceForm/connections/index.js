import { call, put, takeEvery, select, race, take } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import { createFormValuesPatchSet } from '../index';
import * as selectors from '../../../reducers/index';

export const PING_STATES = {
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};
Object.freeze(PING_STATES);
function* createPayload({ values, resourceType, resourceId }) {
  // TODO: Select resource Data staged changes should be included
  const connectionResource = yield select(
    selectors.resource,
    resourceType,
    resourceId
  );
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
  });

  return jsonpatch.applyPatch(connectionResource, patchSet).newDocument;
}

export function* pingConnection({ resourceType, resourceId, values }) {
  let pingCallStatus;

  try {
    const connectionPayload = yield call(createPayload, {
      values,
      resourceType,
      resourceId,
    });
    // Either apiResp or canelTask can race successfully
    // , both will never happen
    const { apiResp, cancelTask } = yield race({
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
          pingConnectionParams.opts.method,
          'Connection is working fine!'
        )
      );
      pingCallStatus = PING_STATES.SUCCESS;
    }

    if (cancelTask) pingCallStatus = PING_STATES.CANCELLED;
  } catch (e) {
    // The ping test gives back a 200 response if the ping connection has failed
    if (e.status === 200) {
      // these errors are json errors
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      yield put(
        actions.api.failure(
          pingConnectionParams.path,
          pingConnectionParams.opts.method,
          errors[0].message
        )
      );
    }

    pingCallStatus = PING_STATES.ERROR;
  }

  return pingCallStatus;
}

export default [takeEvery(actionTypes.TEST_CONNECTION, pingConnection)];
