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
// import { GLOBAL_PREFERENCES } from '../../reducers/user/preferences';

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

export function* updatePreferences() {
  const updatedPayload = yield select(selectors.userPreferences);

  try {
    const payload = {
      ...updatePreferencesParams.opts,
      body: updatedPayload,
    };

    yield call(
      apiCallWithRetry,
      updatePreferencesParams.path,
      payload,
      "Updating user's info"
    );
  } catch (e) {
    yield put(
      actions.api.failure(
        updatePreferencesParams.path,
        'Could not update user Preferences'
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

    yield call(
      apiCallWithRetry,
      updateProfileParams.path,
      payload,
      "Updating user's info"
    );
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
    }

    yield put(
      actions.api.failure(
        changeEmailParams.path,
        'Cannot change user Email , Please try again.'
      )
    );
  }
}

export const userSagas = [
  takeEvery(actionTypes.UPDATE_PROFILE, updateProfile),
  takeEvery(actionTypes.UPDATE_PREFERENCES, updatePreferences),
  takeEvery(actionTypes.USER_CHANGE_EMAIL, changeEmail),
  takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
];
