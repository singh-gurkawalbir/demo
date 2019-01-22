import { call, put, takeEvery, select } from 'redux-saga/effects';
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

const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
];

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

export function* updatePreferencesToAccount(dataToUpdate) {
  let origPreferences = yield select(selectors.userOrigPreferences);
  const { defaultAShareId } = origPreferences;
  let payload;
  const global = {};
  const local = {};

  Object.keys(dataToUpdate).forEach(preference => {
    if (GLOBAL_PREFERENCES.includes(preference)) {
      global[preference] = dataToUpdate[preference];
    } else {
      local[preference] = dataToUpdate[preference];
    }
  });

  if (!defaultAShareId || defaultAShareId === 'own') {
    payload = { ...origPreferences, ...global, ...local };
  } else {
    origPreferences = { ...origPreferences, ...global };

    origPreferences.accounts[defaultAShareId] = {
      ...origPreferences.accounts[defaultAShareId],
      ...local,
    };
    payload = origPreferences;
  }

  return payload;
}

export function* updatePreferences({ preferences }) {
  if (!preferences) return;

  const preferencePayload = yield call(updatePreferencesToAccount, preferences);

  try {
    const payload = {
      ...updatePreferencesParams.opts,
      body: preferencePayload,
    };

    yield call(
      apiCallWithRetry,
      updatePreferencesParams.path,
      payload,
      "Updating user's info"
    );

    yield put(actions.profile.updatePreferenceStore(preferences));
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
