import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import {
  changeEmailParams,
  changePasswordParams,
  updatePreferencesParams,
  updateProfileParams,
} from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { ACCOUNT_IDS } from '../../utils/constants';

export function* changePassword({ updatedPassword }) {
  try {
    const payload = { ...changePasswordParams.opts, body: updatedPassword };

    yield call(apiCallWithRetry, {
      path: changePasswordParams.path,
      opts: payload,
      message: "Changing user's password",
      hidden: true,
    });
    yield put(
      actions.api.complete(
        changePasswordParams.path,
        changePasswordParams.opts.method,
        'Success!! Changed user password'
      )
    );
  } catch (e) {
    yield put(
      actions.api.failure(
        changePasswordParams.path,
        changePasswordParams.opts.method,
        'Invalid credentials provided.  Please try again.'
      )
    );
  }
}

export function* updatePreferences() {
  const updatedPayload = yield select(selectors.userOwnPreferences);

  try {
    const payload = {
      ...updatePreferencesParams.opts,
      body: updatedPayload,
    };

    yield call(apiCallWithRetry, {
      path: updatePreferencesParams.path,
      opts: payload,
      message: "Updating user's info",
    });
  } catch (e) {
    yield put(
      actions.api.failure(
        updatePreferencesParams.path,
        updatePreferencesParams.opts.method,
        'Could not update user Preferences'
      )
    );
  }
}

export function* requestTrialLicense() {
  const { path, opts } = getRequestOptions(actionTypes.LICENSE_TRIAL_REQUEST);
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Requesting trial license',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.accounts.trialLicenseIssued(response));
}

export function* requestLicenseUpgrade() {
  const { path, opts } = getRequestOptions(actionTypes.LICENSE_UPGRADE_REQUEST);
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Requesting license upgrade',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.accounts.licenseUpgradeRequestSubmitted(response));
}

export function* updateProfile() {
  const updatedPayload = yield select(selectors.userProfile);

  try {
    const payload = {
      ...updateProfileParams.opts,
      body: updatedPayload,
    };

    yield call(apiCallWithRetry, {
      path: updateProfileParams.path,
      opts: payload,
      message: "Updating user's info",
    });
  } catch (e) {
    yield put(
      actions.api.failure(
        updateProfileParams.path,
        updateProfileParams.opts.method,
        'Could not update user Profile'
      )
    );
  }
}

export function* changeEmail({ updatedEmail }) {
  try {
    const payload = { ...changeEmailParams.opts, body: updatedEmail };

    yield call(apiCallWithRetry, {
      path: changeEmailParams.path,
      opts: payload,
      message: "Changing user's Email",
      hidden: true,
    });
    yield put(
      actions.api.complete(
        changeEmailParams.path,
        changeEmailParams.opts.method,
        'Success!! Sent user change Email setup to you email'
      )
    );
  } catch (e) {
    if (e.status === 403) {
      yield put(
        actions.api.failure(
          changeEmailParams.path,
          changeEmailParams.opts.method,
          'Existing email provided, Please try again.'
        )
      );
    }

    yield put(
      actions.api.failure(
        changeEmailParams.path,
        changeEmailParams.opts.method,
        'Cannot change user Email , Please try again.'
      )
    );
  }
}

export function* acceptAccountInvite({ id }) {
  const path = `/ashares/${id}/accept`;
  const opts = {
    method: 'PUT',
    body: {},
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Accepting account share invite',
    });
  } catch (e) {
    return yield put(
      actions.api.failure(
        path,
        opts.method,
        'Could not accept account share invite'
      )
    );
  }

  const userPreferences = yield select(selectors.userPreferences);

  if (userPreferences.defaultAShareId === ACCOUNT_IDS.OWN) {
    yield put(actions.auth.clearStore());
    yield put(actions.auth.initSession());
  } else {
    yield put(actions.resource.requestCollection('shared/ashares'));
  }
}

export function* rejectAccountInvite({ id }) {
  const path = `/ashares/${id}/dismiss`;
  const opts = {
    method: 'PUT',
    body: {},
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Rejecting account share invite',
    });
  } catch (e) {
    return yield put(
      actions.api.failure(
        path,
        opts.method,
        'Could not reject account share invite'
      )
    );
  }

  yield put(actions.resource.requestCollection('shared/ashares'));
}

export function* switchAccount({ id, environment }) {
  const userPreferences = yield select(selectors.userPreferences);

  try {
    yield put(
      actions.user.preferences.update({
        defaultAShareId: id,
        environment,
      })
    );
  } catch (ex) {
    // is it put?
    return yield put(
      actions.api.failure('switch account', 'PUT', 'Could not switch account')
    );
  }

  if (userPreferences.defaultAShareId !== id) {
    yield put(actions.auth.clearStore());
    yield put(actions.auth.initSession());
  }
}

export function* leaveAccount({ id }) {
  const path = `/shared/ashares/${id}`;
  const opts = { method: 'DELETE', body: {} };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Leaving account',
    });
  } catch (e) {
    return yield put(
      actions.api.failure(path, opts.method, 'Could not leave account')
    );
  }

  const userPreferences = yield select(selectors.userPreferences);

  if (userPreferences.defaultAShareId === id) {
    yield put(actions.auth.clearStore());
    yield put(actions.auth.initSession());
  } else {
    yield put(actions.resource.requestCollection('shared/ashares'));
  }
}

export function* createUser({ user }) {
  const requestOptions = getRequestOptions(actionTypes.USER_CREATE);
  const { path, opts } = requestOptions;

  opts.body = user;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Inviting User',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.users.created(response));
}

export function* updateUser({ _id, user }) {
  const requestOptions = getRequestOptions(actionTypes.USER_UPDATE, {
    resourceId: _id,
  });
  const { path, opts } = requestOptions;

  opts.body = user;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Updating User',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.users.updated({ ...user, _id }));
}

export function* deleteUser({ _id }) {
  const requestOptions = getRequestOptions(actionTypes.USER_DELETE, {
    resourceId: _id,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Deleting User',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.users.deleted(_id));
}

export function* disableUser({ _id, disabled }) {
  const requestOptions = getRequestOptions(actionTypes.USER_DISABLE, {
    resourceId: _id,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: disabled ? 'Enabling User' : 'Disabling User',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.user.org.users.disabled(_id));
}

export function* makeOwner({ email }) {
  const requestOptions = getRequestOptions(actionTypes.USER_MAKE_OWNER);
  const { path, opts } = requestOptions;

  opts.body = { email, account: true };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Requesting account transfer',
    });
  } catch (e) {
    return true;
  }
}

export const userSagas = [
  takeEvery(actionTypes.UPDATE_PROFILE, updateProfile),
  takeLatest(actionTypes.UPDATE_PREFERENCES, updatePreferences),
  takeEvery(actionTypes.LICENSE_TRIAL_REQUEST, requestTrialLicense),
  takeEvery(actionTypes.LICENSE_UPGRADE_REQUEST, requestLicenseUpgrade),
  takeEvery(actionTypes.USER_CHANGE_EMAIL, changeEmail),
  takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
  takeEvery(actionTypes.ACCOUNT_INVITE_ACCEPT, acceptAccountInvite),
  takeEvery(actionTypes.ACCOUNT_INVITE_REJECT, rejectAccountInvite),
  takeEvery(actionTypes.ACCOUNT_LEAVE_REQUEST, leaveAccount),
  takeEvery(actionTypes.ACCOUNT_SWITCH, switchAccount),
  takeEvery(actionTypes.USER_CREATE, createUser),
  takeEvery(actionTypes.USER_UPDATE, updateUser),
  takeEvery(actionTypes.USER_DISABLE, disableUser),
  takeEvery(actionTypes.USER_DELETE, deleteUser),
  takeEvery(actionTypes.USER_MAKE_OWNER, makeOwner),
];
