import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { MASK_ACCESSTOKEN_TOKEN_DELAY } from '../../utils/constants';

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
  yield delay(MASK_ACCESSTOKEN_TOKEN_DELAY);
  yield put(actions.accessToken.maskToken({ _id: id }));
}

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
  yield delay(MASK_ACCESSTOKEN_TOKEN_DELAY);
  yield put(actions.accessToken.maskToken({ _id: id }));
}

export function* create({ accessToken }) {
  const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_CREATE, {
    integrationId: accessToken._integrationId,
  });
  const { path, opts } = requestOptions;

  opts.body = accessToken;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Creating Access Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.accessToken.created({ ...response }));
}

export function* update({ accessToken }) {
  const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_UPDATE, {
    resourceId: accessToken._id,
  });
  const { path, opts } = requestOptions;

  opts.body = accessToken;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Updating Access Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.accessToken.updated({ ...response }));
}

export function* deleteAccessToken({ id }) {
  const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_DELETE, {
    resourceId: id,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Deleting Access Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.accessToken.deleted(id));
}

export const accessTokenSagas = [
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, generateToken),
  takeEvery(actionTypes.ACCESSTOKEN_CREATE, create),
  takeEvery(actionTypes.ACCESSTOKEN_UPDATE, update),
  takeEvery(actionTypes.ACCESSTOKEN_DELETE, deleteAccessToken),
];
