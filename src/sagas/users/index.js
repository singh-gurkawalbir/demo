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
  const requestOptions = {
    opts: {
      method: 'PUT',
    },
    path: `/ashares/${id}/accept`,
  };

  try {
    const payload = {
      ...requestOptions.opts,
      body: {},
    };

    yield call(apiCallWithRetry, {
      path: requestOptions.path,
      opts: payload,
      message: 'Accepting account share invite',
    });

    yield put(actions.resource.requestCollection('shared/ashares'));
  } catch (e) {
    yield put(
      actions.api.failure(
        requestOptions.path,
        'Could not accept account share invite'
      )
    );
  }
}

export function* rejectAccountInvite({ id }) {
  const requestOptions = {
    opts: {
      method: 'PUT',
    },
    path: `/ashares/${id}/dismiss`,
  };

  try {
    const payload = {
      ...requestOptions.opts,
      body: {},
    };

    yield call(apiCallWithRetry, {
      path: requestOptions.path,
      opts: payload,
      message: 'Rejecting account share invite',
    });

    yield put(actions.resource.requestCollection('shared/ashares'));
  } catch (e) {
    yield put(
      actions.api.failure(
        requestOptions.path,
        'Could not reject account share invite'
      )
    );
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
  takeEvery(actionTypes.ACCOUNT_INVITE_ACCEPT, rejectAccountInvite),
];
