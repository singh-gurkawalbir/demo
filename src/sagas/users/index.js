import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import {
  changeEmailParams,
  changePasswordParams,
  updatePreferencesParams,
  requestTrialLicenseParams,
  requestLicenseUpgradeParams,
  updateProfileParams,
} from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import getErrorMessage from '../../utils/apiException';
import getRequestOptions from '../../utils/requestOptions';

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
        'Success!! Changed user password'
      )
    );
  } catch (e) {
    yield put(
      actions.api.failure(
        changePasswordParams.path,
        'Invalid credentials provided.  Please try again.'
      )
    );
  }
}

export function* updatePreferences() {
  const updatedPayload = yield select(selectors.userPreferences);

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
        'Could not update user Preferences'
      )
    );
  }
}

export function* requestTrialLicense() {
  try {
    const payload = {
      ...requestTrialLicenseParams.opts,
      body: {},
    };
    const response = yield call(apiCallWithRetry, {
      path: requestTrialLicenseParams.path,
      opts: payload,
      message: 'Requesting trial license',
    });

    yield put(actions.user.org.accounts.trialLicenseIssued(response));
  } catch (e) {
    yield put(
      actions.api.failure(
        requestTrialLicenseParams.path,
        'Could not start trial'
      )
    );
  }
}

export function* requestLicenseUpgrade() {
  try {
    const payload = {
      ...requestTrialLicenseParams.opts,
      body: {},
    };
    const response = yield call(apiCallWithRetry, {
      path: requestLicenseUpgradeParams.path,
      opts: payload,
      message: 'Requesting license upgrade',
    });

    yield put(
      actions.user.org.accounts.licenseUpgradeRequestSubmitted(response)
    );
  } catch (e) {
    yield put(
      actions.api.failure(
        requestLicenseUpgradeParams.path,
        'Could not request license upgrade'
      )
    );
  }
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
        'Success!! Sent user change Email setup to you email'
      )
    );
  } catch (e) {
    if (e.status === 403) {
      yield put(
        actions.api.failure(
          changeEmailParams.path,
          'Existing email provided, Please try again.'
        )
      );
    }

    yield put(
      actions.api.failure(
        changeEmailParams.path,
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

    yield put(actions.resource.requestCollection('shared/ashares'));
  } catch (e) {
    yield put(
      actions.api.failure(path, 'Could not accept account share invite')
    );
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

    yield put(actions.resource.requestCollection('shared/ashares'));
  } catch (e) {
    yield put(
      actions.api.failure(path, 'Could not reject account share invite')
    );
  }
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
    return yield put(
      actions.api.failure('switch account', 'Could not switch account')
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
    return yield put(actions.api.failure(path, 'Could not leave account'));
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
    return yield put(actions.api.failure(path, getErrorMessage(e)));
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
    return yield put(actions.api.failure(path, getErrorMessage(e)));
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
    return yield put(actions.api.failure(path, getErrorMessage(e)));
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
    return yield put(actions.api.failure(path, getErrorMessage(e)));
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
      message: 'Updating User',
    });
  } catch (e) {
    yield put(actions.api.failure(path, getErrorMessage(e)));
  }
}

export const userSagas = [
  takeEvery(actionTypes.UPDATE_PROFILE, updateProfile),
  takeEvery(actionTypes.UPDATE_PREFERENCES, updatePreferences),
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
