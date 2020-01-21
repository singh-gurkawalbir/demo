import {
  call,
  put,
  takeEvery,
  delay,
  select,
  take,
  fork,
  cancel,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers';

export function* generateToken({ id }) {
  const requestOptions = getRequestOptions(
    actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
    {
      resourceId: id,
    }
  );
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Generating Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.accessToken.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(
    actions.accessToken.maskToken({
      _id: id,
    })
  );
}

export function* displayToken({ id }) {
  const requestOptions = getRequestOptions(
    actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
    {
      resourceId: id,
    }
  );
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Getting Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.accessToken.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(
    actions.accessToken.maskToken({
      _id: id,
    })
  );
}

export function* checkAndRemovePurgedTokens() {
  const { resources = [] } = yield select(selectors.resourceList, {
    type: 'accesstokens',
  });
  let minAutoPurgeAt;

  resources.forEach(r => {
    if (r.autoPurgeAt) {
      if (!minAutoPurgeAt) {
        minAutoPurgeAt = r.autoPurgeAt;
      } else if (minAutoPurgeAt > r.autoPurgeAt) {
        minAutoPurgeAt = r.autoPurgeAt;
      }
    }
  });

  if (!minAutoPurgeAt) {
    return false;
  }

  /** Wait until one second before the autoPureAt */
  yield delay(Math.max(new Date(minAutoPurgeAt) - new Date() - 1000, 0));
  yield put(actions.accessToken.deletePurged());
  yield put(actions.accessToken.updatedCollection());
}

export function* accessTokensUpdated() {
  const watcher = yield fork(checkAndRemovePurgedTokens);

  yield take(actionTypes.ACCESSTOKEN_UPDATED_COLLECTION);
  yield cancel(watcher);
}

export function* resourcesReceived({ resourceType }) {
  if (resourceType === 'accesstokens') {
    yield put(actions.accessToken.updatedCollection());
  }
}

export const accessTokenSagas = [
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, generateToken),
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.RESOURCE.RECEIVED_COLLECTION, resourcesReceived),
  takeEvery(actionTypes.RESOURCE.RECEIVED, resourcesReceived),
  takeEvery(actionTypes.ACCESSTOKEN_UPDATED_COLLECTION, accessTokensUpdated),
];
