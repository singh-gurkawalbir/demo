import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import {
  changeEmailParams,
  changePasswordParams,
  updatePreferencesParams,
  updateProfileParams,
} from '../api/apiPaths';
import { apiCallWithRetry } from '../index';

export function* changePassword({ updatedPassword }) {
  try {
    const payload = { ...changePasswordParams.opts, body: updatedPassword };

    yield call(
      apiCallWithRetry,
      changePasswordParams.path,
      payload,
      "Changing user's password",
      true
    );
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

export function* updatePreferences({ preferences }) {
  if (preferences === {}) return;

  try {
    const payload = {
      ...updatePreferencesParams.opts,
      body: preferences,
    };

    yield call(
      apiCallWithRetry,
      updatePreferencesParams.path,
      payload,
      "Updating user's info"
    );
    yield put(actions.resource.receivedCollection('preferences', preferences));
  } catch (e) {
    yield put(
      actions.api.failure(
        updatePreferencesParams.path,
        'Could not update user Preferences'
      )
    );
  }
}

export function* updateProfile(profile) {
  try {
    const payload = {
      ...updateProfileParams.opts,
      body: profile,
    };

    yield call(
      apiCallWithRetry,
      updateProfileParams.path,
      payload,
      "Updating user's info"
    );
    yield put(actions.resource.received('profile', profile));
  } catch (e) {
    yield put(
      actions.api.failure(
        updateProfileParams.path,
        'Could not update user Profile'
      )
    );
  }
}

export function* updateUserProfileAndPreferences({
  profilePreferencesPayload,
}) {
  const { _id, timeFormat, dateFormat } = profilePreferencesPayload;

  yield updatePreferences({ preferences: { _id, timeFormat, dateFormat } });
  const copy = { ...profilePreferencesPayload };

  delete copy.dateFormat;
  delete copy.timeFormat;
  const profile = copy;

  yield updateProfile(profile);
}

export function* changeEmail({ updatedEmail }) {
  try {
    const payload = { ...changeEmailParams.opts, body: updatedEmail };

    yield call(
      apiCallWithRetry,
      changeEmailParams.path,
      payload,
      "Changing user's Email",
      true
    );
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

      return;
    }

    yield put(
      actions.api.failure(
        changeEmailParams.path,
        'Cannot change user Email , Please try again.'
      )
    );
  }
}

export const modalsSagas = [
  takeEvery(
    actionTypes.UPDATE_PROFILE_PREFERENCES,
    updateUserProfileAndPreferences
  ),
  takeEvery(actionTypes.UPDATE_PREFERENCES, updatePreferences),
  takeEvery(actionTypes.USER_CHANGE_EMAIL, changeEmail),
  takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
];
