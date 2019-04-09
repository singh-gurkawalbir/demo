import { call, put, takeEvery, select } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import * as selectors from '../../../reducers/index';

// ping exception
function PingException(response) {
  this.message = response.errors
    .map(error => error.message)
    .reduce((initialValue, iter) => initialValue + iter, '');
}

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
    const resp = yield call(apiCallWithRetry, {
      path: pingConnectionParams.path,
      opts: { body: connectionPayload, ...pingConnectionParams.opts },
      hidden: true,
    });

    if (resp && resp.errors) throw new PingException(resp);
    yield put(
      actions.api.complete(
        pingConnectionParams.path,
        'Connection is working fine!'
      )
    );
  } catch (errors) {
    if (errors.status === 'ABORTED') {
      yield put(
        actions.api.complete(
          pingConnectionParams.path,
          'Task has been cancelled'
        )
      );

      return;
    }

    yield put(actions.api.failure(pingConnectionParams.path, errors.message));
  }
}

export default [takeEvery(actionTypes.TEST_CONNECTION, pingConnection)];
