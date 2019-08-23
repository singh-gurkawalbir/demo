import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

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
    return true;
  }

  yield put(actions.stack.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(actions.stack.maskToken({ _id: id }));
}

export function* generateToken({ id }) {
  const path = `/stacks/${id}/systemToken`;
  let response;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: 'Deleting Stack Token',
    });

    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: 'Generating Stack Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.stack.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(actions.stack.maskToken({ _id: id }));
}

export function* getStackShareCollection() {
  const path = '/sshares';
  let collection;

  try {
    collection = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: 'Getting Stack Share Collection',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.stack.receivedStackShareCollection({ collection }));
}

export function* deleteStackShareUser({ userId }) {
  const path = `/sshares/${userId}`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: 'Deleting Stack Share User',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.stack.deletedStackShareUser({ userId }));
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
    return true;
  }

  yield call(getStackShareCollection);
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
    return true;
  }

  yield put(actions.stack.toggledUserStackSharing({ userId }));
}

export const stackSagas = [
  takeEvery(actionTypes.STACK.TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.STACK.TOKEN_GENERATE, generateToken),
  takeEvery(
    actionTypes.STACK.STACK_SHARE_COLLECTION_REQUEST,
    getStackShareCollection
  ),
  takeEvery(actionTypes.STACK.STACK_SHARE_USER_DELETE, deleteStackShareUser),
  takeEvery(actionTypes.STACK.STACK_SHARE_USER_INVITE, inviteStackShareUser),
  takeEvery(
    actionTypes.STACK.USER_STACK_SHARING_TOGGLE,
    toggleUserStackSharing
  ),
];
