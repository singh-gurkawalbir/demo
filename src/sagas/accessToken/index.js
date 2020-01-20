import {
  call,
  put,
  takeEvery,
  delay,
  fork,
  take,
  cancel,
  select,
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
  let delayUntil;

  resources.forEach(r => {
    if (r.autoPurgeAt) {
      if (!delayUntil) {
        delayUntil = r.autoPurgeAt;
      } else if (new Date(delayUntil) > new Date(r.autoPurgeAt)) {
        delayUntil = r.autoPurgeAt;
      }
    }
  });

  if (delayUntil) {
    yield delay(Math.max(new Date(delayUntil) - new Date(), 1000));
    yield call(actions.accessToken.deletePurged());
  }
}

export function* receivedCollection({ resourceType }) {
  console.log(`***** in receivedCollection resourceType ${resourceType}`);

  if (resourceType !== 'accesstokens') {
    return false;
  }

  const watcher = yield fork(checkAndRemovePurgedTokens);

  yield take([
    actionTypes.RESOURCE.RECEIVED_COLLECTION,
    actionTypes.RESOURCE.RECEIVED,
  ]);
  yield cancel(watcher);
}

export const accessTokenSagas = [
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, generateToken),
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.RESOURCE.RECEIVED_COLLECTION, receivedCollection),
  takeEvery(actionTypes.RESOURCE.RECEIVED, receivedCollection),
];
