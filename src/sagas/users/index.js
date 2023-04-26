import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import {
  changeEmailParams,
  changePasswordParams,
  updatePreferencesParams,
  updateProfileParams,
} from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../constants';
import { getResourceCollection } from '../resources';
import { checkAndUpdateDefaultSetId } from '../authentication';

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
        'Password changed.'
      )
    );
  } catch (e) {
    let errorMsg;

    try {
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      errorMsg = errors && errors[0].message;
    } catch (e) {
      errorMsg = 'Invalid credentials provided.  Please try again.';
    }

    yield put(
      actions.api.failure(
        changePasswordParams.path,
        changePasswordParams.opts.method,
        errorMsg,
        true
      )
    );
  }
}

export function* updatePreferences({ skipSaga = false } = {}) {
  if (skipSaga) {
    return true;
  }
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
  const { path, opts } = getRequestOptions(actionTypes.LICENSE.TRIAL_REQUEST);
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      hidden: true,
      message: 'Requesting trial license',
    });
  } catch (e) {
    return true;
  }
  yield put(actions.license.trialLicenseIssued(response));
  yield call(getResourceCollection, {resourceType: 'licenses', refresh: true });
}

export function* requestLicenseUpgrade() {
  const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPGRADE_REQUEST);
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      hidden: true,
      message: 'Requesting license upgrade',
    });
  } catch (e) {
    try {
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      const errorCode = errors?.map(error => error.code) || [];

      if (errorCode.includes('ratelimit_exceeded')) {
        return yield put(actions.api.failure(path, 'POST', 'You have already submitted an upgrade request. We will be in touch soon.', false));
      }
    // eslint-disable-next-line no-empty
    } catch (e) {
    }

    return true;
  }

  yield put(actions.license.licenseUpgradeRequestSubmitted(response));
}

export function* requestLicenseUpdate({ actionType, connectorId, licenseId, feature }) {
  const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPDATE_REQUEST, {
    actionType, connectorId, licenseId, feature,
  });
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts,
      hidden: ['upgrade', 'ioRenewal'].includes(actionType),
    });
  } catch (error) {
    let errorCode;

    try {
      const errorsJSON = JSON.parse(error.message);
      const { errors } = errorsJSON;

      errorCode = errors?.map(error => error.code) || [];
    // eslint-disable-next-line no-empty
    } catch (e) {
    }
    if (errorCode?.includes('ratelimit_exceeded')) {
      return yield put(actions.api.failure(path, 'POST', 'You have already submitted an upgrade request. We will be in touch soon.', false));
    }

    return yield put(actions.api.failure(path, 'POST', error, false));
  }
  if (actionType === 'ioResume') {
    yield put(actions.resource.requestCollection('integrations'));
    yield put(actions.resource.requestCollection('flows'));
    yield put(actions.resource.requestCollection('exports'));
    yield put(actions.resource.requestCollection('imports'));
    yield put(actions.license.refreshCollection());
    yield put(actions.license.licenseReactivated());
  } else {
    yield put(actions.license.licenseUpgradeRequestSubmitted(response, feature));
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
        updateProfileParams.opts.method,
        'Could not update user Profile'
      )
    );
  }
}

export function* unlinkWithGoogle() {
  const path = '/unlink/google';
  const method = 'post';

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method,
      },
      message: 'Unlinking with Google',
    });
    yield put(actions.user.profile.unlinkedWithGoogle());
  } catch (e) {
    yield put(
      actions.api.failure(path, method, 'Could not unlink with Google')
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
        'Verification link sent to new email address.'
      )
    );
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
}

export function* switchAccount({ preferences }) {
  yield call(updatePreferences);

  return yield put(actions.auth.abortAllSagasAndSwitchAcc(preferences?.defaultAShareId));
}

// user is disabling/deleting/removing his own user in userList we should reinitialise the session and set the defaultAShareId to next valid accountId or as own(if no other shared account present)
export function* switchAccountActions() {
  yield call(checkAndUpdateDefaultSetId);
  yield put(actions.auth.clearStore({ authenticated: true }));
  yield put(actions.auth.initSession({ switchAcc: true }));
}

export function* leaveAccount({ id, isSwitchAccount }) {
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

  if (isSwitchAccount) {
    yield call(switchAccountActions);
  } else {
    yield put(actions.resource.requestCollection('shared/ashares'));
  }
}

export function* createUser({ user, asyncKey }) {
  const requestOptions = getRequestOptions(actionTypes.USER.CREATE);
  const { path, opts } = requestOptions;

  yield put(actions.asyncTask.start(asyncKey));
  opts.body = user;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Inviting User',
    });
  } catch (e) {
    yield put(actions.asyncTask.failed(asyncKey));

    return true;
  }
  yield put(actions.asyncTask.success(asyncKey));
  yield put(actions.user.org.users.created(response));
}

export function* updateUser({ _id, user, asyncKey }) {
  yield put(actions.asyncTask.start(asyncKey));

  const requestOptions = getRequestOptions(actionTypes.USER.UPDATE, {
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
    yield put(actions.asyncTask.failed(asyncKey));

    return true;
  }
  yield put(actions.asyncTask.success(asyncKey));
  yield put(actions.user.org.users.updated({ ...user, _id }));
}

export function* deleteUser({ _id, isSwitchAccount }) {
  const requestOptions = getRequestOptions(actionTypes.USER.DELETE, {
    resourceId: _id,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Deleting User',
      hidden: true, // showing error is being handling by component
    });
  } catch (e) {
    return true;
  }

  if (isSwitchAccount) {
    yield call(switchAccountActions);
  }

  yield put(actions.user.org.users.deleted(_id));
}

export function* disableUser({ _id, disabled, isSwitchAccount }) {
  const requestOptions = getRequestOptions(actionTypes.USER.DISABLE, {
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

  if (isSwitchAccount) {
    yield call(switchAccountActions);
  }

  yield put(actions.user.org.users.disabled(_id));
}
export function* reinviteUser({ _id }) {
  const requestOptions = getRequestOptions(actionTypes.USER.REINVITE, {
    resourceId: _id,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Reinviting User',
    });
  } catch (e) {
    yield put(actions.user.org.users.reinviteError(_id));

    return true;
  }

  yield put(actions.user.org.users.reinvited(_id));
}

export function* makeOwner({ email }) {
  const requestOptions = getRequestOptions(actionTypes.USER.MAKE_OWNER);
  const { path, opts } = requestOptions;

  opts.body = { email, account: true };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Requesting account transfer',
      hidden: true, // showing error is being handling by component
    });
  } catch (e) {
    return true;
  }
}

export function* requestSharedStackNotifications() {
  const { defaultAShareId } = yield select(selectors.userPreferences);

  if (defaultAShareId === ACCOUNT_IDS.OWN) {
    yield put(actions.resource.requestCollection('shared/sshares'));
  }
}

export function* acceptSharedInvite({ resourceType, id, isAccountTransfer }) {
  const sharedResourceTypeMap = {
    account: 'ashares',
    stack: 'sshares',
    transfer: 'transfers',
  };
  const path = `/${sharedResourceTypeMap[resourceType]}/${id}/accept`;
  const opts = {
    method: 'PUT',
    body: {},
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: `Accepting ${resourceType} share invite`,
    });
  } catch (e) {
    return true;
  }

  const userPreferences = yield select(selectors.userPreferences);

  if (
    resourceType === 'account' &&
    userPreferences.defaultAShareId === ACCOUNT_IDS.OWN
  ) {
    yield put(
      actions.user.preferences.update({
        defaultAShareId: id,
        environment: 'production',
      }, true)
    ); // incase the account which is accepted has mfa required. we need to update the preference first so that initSession can set requiredMfaSetUp to true.
    yield call(updatePreferences); // we have wait till preference get updated in the DB to proceed further.
    yield put(actions.auth.clearStore({ authenticated: true }));
    yield put(actions.auth.initSession());
  } else if (resourceType === 'transfer') {
    if (isAccountTransfer) {
      yield put(actions.app.userAcceptedAccountTransfer());
    } else {
      yield put(actions.resource.requestCollection('integrations'));
      yield put(actions.resource.requestCollection('transfers'));
      yield put(actions.resource.requestCollection('tiles'));
      yield put(actions.resource.requestCollection('connections'));
    }
  } else {
    yield put(
      actions.resource.requestCollection(
        `shared/${sharedResourceTypeMap[resourceType]}`
      )
    );
  }
}

export function* rejectSharedInvite({ resourceType, id }) {
  const sharedResourceTypeMap = {
    account: 'ashares',
    stack: 'sshares',
    transfer: 'transfers',
  };
  const path = `/${sharedResourceTypeMap[resourceType]}/${id}/dismiss`;
  const opts = {
    method: 'PUT',
    body: {},
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
      message: `Rejecting ${resourceType} share invite`,
    });
  } catch (e) {
    return yield put(
      actions.api.failure(
        path,
        opts.method,
        `Could not reject ${resourceType} share invite`
      )
    );
  }
  if (resourceType === 'transfer') {
    const { accessLevel } = yield select(selectors.resourcePermissions);

    if (accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
      yield put(actions.resource.requestCollection('transfers'));
    } else {
      yield put(actions.resource.requestCollection('transfers/invited'));
    }
  } else {
    yield put(
      actions.resource.requestCollection(
        `shared/${sharedResourceTypeMap[resourceType]}`
      )
    );
  }
}

export function* requestNumEnabledFlows() {
  const { path, opts } = getRequestOptions(
    actionTypes.LICENSE.NUM_ENABLED_FLOWS_REQUEST
  );
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (error) {
    return yield put(actions.api.failure(path, 'GET', error, false));
  }

  yield put(actions.license.receivedNumEnabledFlows(response));
}
export function* requestLicenseEntitlementUsage() {
  const { path, opts } = getRequestOptions(
    actionTypes.LICENSE.ENTITLEMENT_USAGE_REQUEST
  );
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (error) {
    return yield put(actions.api.failure(path, 'GET', error, false));
  }

  yield put(actions.license.receivedLicenseEntitlementUsage(response));
}

export function* addSuiteScriptLinkedConnection({ connectionId }) {
  const path = `/preferences/ssConnectionIds/${connectionId}`;
  const opts = { method: 'PUT', body: {} };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return yield put(
      actions.api.failure(
        path,
        opts.method,
        'Could not link suitescript integrator'
      )
    );
  }

  yield put(actions.resource.requestCollection('shared/ashares'));
}

export function* deleteSuiteScriptLinkedConnection({ connectionId }) {
  const path = `/preferences/ssConnectionIds/${connectionId}`;
  const opts = { method: 'DELETE', body: {} };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return yield put(
      actions.api.failure(
        path,
        opts.method,
        'Could not unlink suitescript integrator'
      )
    );
  }

  yield put(actions.resource.requestCollection('shared/ashares'));
}

export function* refreshLicensesCollection() {
  const defaultAShareId = yield select(selectors.defaultAShareId);

  if (defaultAShareId && defaultAShareId !== 'own') {
    yield put(actions.resource.requestCollection('shared/ashares'));

    return;
  }

  yield put(actions.resource.requestCollection('licenses'));
}

export const userSagas = [
  takeLatest(actionTypes.USER.PROFILE.UNLINK_WITH_GOOGLE, unlinkWithGoogle),
  takeLatest(actionTypes.USER.PROFILE.UPDATE, updateProfile),
  takeLatest([actionTypes.USER.PREFERENCES.UPDATE,
    actionTypes.USER.PREFERENCES.PIN_INTEGRATION,
    actionTypes.USER.PREFERENCES.UNPIN_INTEGRATION], updatePreferences),
  takeEvery(actionTypes.LICENSE.TRIAL_REQUEST, requestTrialLicense),
  takeEvery(actionTypes.LICENSE.UPGRADE_REQUEST, requestLicenseUpgrade),
  takeEvery(actionTypes.AUTH.USER.CHANGE_EMAIL, changeEmail),
  takeEvery(actionTypes.AUTH.USER.CHANGE_PASSWORD, changePassword),
  takeEvery(actionTypes.USER.ACCOUNT.LEAVE_REQUEST, leaveAccount),
  takeEvery(actionTypes.USER.ACCOUNT.SWITCH, switchAccount),
  takeEvery(actionTypes.USER.CREATE, createUser),
  takeEvery(actionTypes.USER.UPDATE, updateUser),
  takeEvery(actionTypes.USER.DISABLE, disableUser),
  takeEvery(actionTypes.USER.DELETE, deleteUser),
  takeEvery(actionTypes.USER.MAKE_OWNER, makeOwner),
  takeEvery(actionTypes.AUTH.DEFAULT_ACCOUNT_SET, requestSharedStackNotifications),
  takeEvery(actionTypes.USER.SHARED_NOTIFICATION_ACCEPT, acceptSharedInvite),
  takeEvery(actionTypes.USER.SHARED_NOTIFICATION_REJECT, rejectSharedInvite),
  takeEvery(
    actionTypes.LICENSE.ENTITLEMENT_USAGE_REQUEST,
    requestLicenseEntitlementUsage
  ),
  takeEvery(
    actionTypes.LICENSE.NUM_ENABLED_FLOWS_REQUEST,
    requestNumEnabledFlows
  ),
  takeLatest(actionTypes.LICENSE.UPDATE_REQUEST, requestLicenseUpdate),
  takeEvery(
    actionTypes.USER.ACCOUNT.ADD_SUITESCRIPT_LINKED_CONNECTION,
    addSuiteScriptLinkedConnection
  ),
  takeEvery(
    actionTypes.USER.ACCOUNT.DELETE_SUITESCRIPT_LINKED_CONNECTION,
    deleteSuiteScriptLinkedConnection
  ),
  takeLatest(actionTypes.USER.REINVITE, reinviteUser),
  takeEvery(actionTypes.LICENSE.REFRESH_COLLECTION, refreshLicensesCollection),
];
