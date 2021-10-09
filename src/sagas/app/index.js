
import { put, select, delay, call, race, takeEvery, take } from 'redux-saga/effects';
import {isEqual} from 'lodash';
import { selectors } from '../../reducers';
import { POLLING_STATUS } from '../../reducers/app';
import actionTypes from '../../actions/types';

export const POLL_SAMPLE_INTERVAL = 1000;

export function* pollApiRequests({pollAction, pollSaga, pollSagaArgs, duration}) {
  if (pollAction && pollSaga) {
    throw new Error('Cannot have both pollAction and pollSaga provided, the poll saga supports either one');
  }
  while (true) {
    const pollingStatus = yield select(selectors.pollingStatus);

    // if polling status is set to stop ..stop making polling calls and allow the session to expire
    if (pollingStatus === POLLING_STATUS.STOP) {
      // if polling status is set to stop ..stop making polling calls and allow the session to expire
      yield delay(POLL_SAMPLE_INTERVAL);
    } else {
      if (pollAction) {
        yield put(pollAction);
      } else {
        const {terminatePolling} = (yield call(pollSaga, pollSagaArgs)) || {};

        if (terminatePolling) {
          return;
        }
      }

      yield delay(pollingStatus === POLLING_STATUS.SLOW ? duration * 2 : duration);
    }
  }
}

function* pollApiRequestsWithCancelAction(args) {
  const {pollAction: originalPollAction} = args;

  yield race({
    pollApi: call(pollApiRequests, args),
    stopSpecificPoll: take(
      actPayload => {
        const {type, pollActionToStop} = actPayload;

        if (type !== actionTypes.POLLING.STOP_SPECIFIC_POLL) {
          return false;
        }

        return isEqual(originalPollAction, pollActionToStop);
      })
    ,
  });
}
export const appSagas = [takeEvery(actionTypes.POLLING.START, pollApiRequestsWithCancelAction)];
