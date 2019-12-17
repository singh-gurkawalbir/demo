import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { getResourceCollection } from '../resources/index';

export function* displayToken({ id }) {
  const path = `/stacks/${id}/systemToken`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: 'Getting Stack Token',
    });
  } catch (e) {
    return;
  }

  yield put(actions.stack.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(actions.stack.maskToken({ _id: id }));
}

export function* generateToken({ id }) {
  const path = `/stacks/${id}/systemToken`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: 'Deleting Stack Token',
    });
  } catch (e) {
    return;
  }

  yield call(displayToken, { id });
}

export function* inviteStackShareUser({ email, stackId }) {
  const path = `/stacks/${stackId}/invite`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { email },
      },
      message: 'Inviting Stack Share User',
    });
  } catch (e) {
    return;
  }

  yield call(getResourceCollection, { resourceType: 'sshares' });
}

export function* toggleUserStackSharing({ userId }) {
  const path = `/sshares/${userId}/disable`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: {},
      },
      message: 'Toggling User Stack Sharing',
    });
  } catch (e) {
    return;
  }

  yield put(actions.stack.toggledUserStackSharing({ userId }));
}

export function* reInviteStackUser({ userInfo, userId }) {
  const path = `/sshares/${userId}`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: userInfo,
      },
      message: 'Re-inviting Stack User',
    });
  } catch (e) {
    return;
  }

  yield call(getResourceCollection, { resourceType: 'sshares' });
}

export const stackSagas = [
  takeEvery(actionTypes.STACK.TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.STACK.TOKEN_GENERATE, generateToken),
  takeEvery(actionTypes.STACK.SHARE_USER_INVITE, inviteStackShareUser),
  takeEvery(actionTypes.STACK.USER_SHARING_TOGGLE, toggleUserStackSharing),
  takeEvery(actionTypes.STACK.USER_REINVITE, reInviteStackUser),
];
