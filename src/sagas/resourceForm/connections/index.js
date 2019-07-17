import { call, put, takeEvery, select, race, take } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import { createFormValuesPatchSet, submitFormValues } from '../index';
import * as selectors from '../../../reducers/index';
import { commitStagedChanges } from '../../resources';
import { getAdditionalHeaders } from '../../../sagas/api/requestInterceptors';

function* createPayload({ values, resourceId }) {
  const resourceType = 'connections';
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

export function* pingConnection({ resourceId, values }) {
  try {
    const connectionPayload = yield call(createPayload, {
      values,
      resourceType: 'connections',
      resourceId,
    });
    // Either apiResp or cancelTask can race successfully
    // , both will never happen
    const { apiResp } = yield race({
      apiResp: call(apiCallWithRetry, {
        path: pingConnectionParams.path,
        opts: {
          body: connectionPayload,
          ...pingConnectionParams.opts,
        },
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
    }
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
  }
}

export function* openOAuthWindowForConnection(resourceId) {
  const options = 'scrollbars=1,height=600,width=800';
  let url = `/connection/${resourceId}/oauth2`;
  const additionalHeaders = yield call(getAdditionalHeaders, url);

  if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
    url += `?integrator-ashareid=${additionalHeaders['integrator-ashareid']}`;
  }

  const win = window.open(url, '_blank', options);

  if (!win || win.closed || typeof win.closed === 'undefined') {
    // POPUP BLOCKED
    // eslint-disable-next-line no-alert
    window.alert('POPUP blocked');

    try {
      win.close();
    } catch (ex) {
      throw ex;
    }

    return false;
  }

  win.focus();
}

export function* saveAndAuthorizeConnection({ resourceId, values }) {
  try {
    yield call(submitFormValues, {
      resourceType: 'connections',
      resourceId,
      values,
    });
  } catch (e) {
    // could not save the resource...lets just return
    return;
  }

  const { conflict } = yield select(
    selectors.resourceData,
    'connections',
    resourceId
  );

  // if there is conflict let conflict dialog show up
  // and oauth authorize be skipped
  if (conflict) return;

  try {
    yield call(openOAuthWindowForConnection, [resourceId]);
  } catch (e) {
    // could not close the window
  }
}

function* commitAndAuthorizeConnection({ resourceId }) {
  try {
    yield call(commitStagedChanges, {
      resourceType: 'connections',
      id: resourceId,
    });
  } catch (e) {
    // could not save the resource...lets just return
    return;
  }

  // check to see if there is still a conflict
  const { conflict } = yield select(
    selectors.resourceData,
    'connections',
    resourceId
  );

  // if there is conflict let conflict dialog show up
  // and oauth authorize be skipped
  if (conflict) return;

  try {
    yield call(openOAuthWindowForConnection, [resourceId]);
  } catch (e) {
    // could not close the window
  }
}

export default [
  takeEvery(actionTypes.TEST_CONNECTION, pingConnection),

  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE,
    saveAndAuthorizeConnection
  ),

  takeEvery(
    actionTypes.RESOURCE_FORM.COMMIT_AND_AUTHORIZE,
    commitAndAuthorizeConnection
  ),
];
