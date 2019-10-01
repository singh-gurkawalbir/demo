import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';

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

export const accessTokenSagas = [
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, generateToken),
  takeEvery(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, displayToken),
];
