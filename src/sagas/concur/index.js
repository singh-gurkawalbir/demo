import { call, takeEvery, put } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { getCSRFTokenBackend } from '../authentication';
import inferErrorMessages from '../../utils/inferErrorMessages';

export function* concurConnect({module, id, requestToken}) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const apiResponse = yield call(apiCallWithRetry, {
      path: `/concurconnect/${module}?id=${id}&requestToken=${requestToken}`,
      message: 'Validate concur module authentication',
      opts: {
        method: 'POST',
        body: {
          _csrf,
        },
      },
      hidden: true,
    });

    yield put(actions.concur.connectSuccess(apiResponse));
  } catch (e) {
    yield put(actions.concur.connectError(inferErrorMessages(e.message || e)));
  }
}

export const concurSagas = [
  takeEvery(actionTypes.CONCUR.CONNECT, concurConnect),
];
