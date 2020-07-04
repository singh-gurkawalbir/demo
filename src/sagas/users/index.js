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
        errorMsg
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

export function* requestLicenseUpdate({ actionType }) {
  const { path, opts } = getRequestOptions(actionTypes.LICENSE_UPDATE_REQUEST, {
    actionType,
  });
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (error) {
    return yield put(actions.api.failure(path, 'POST', error, false));
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

export function* switchAccount({ id }) {
  const userPreferences = yield select(selectors.userPreferences);

  try {
    yield put(
      actions.user.preferences.update({
        defaultAShareId: id,
        environment: 'production',
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

export function* requestSharedStackNotifications() {
  const { defaultAShareId } = yield select(selectors.userPreferences);

  if (defaultAShareId === ACCOUNT_IDS.OWN) {
    yield put(actions.resource.requestCollection('shared/sshares'));
  }
}

export function* acceptSharedInvite({ resourceType, id }) {
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
    yield put(actions.auth.clearStore());
    yield put(actions.auth.initSession());
  } else if (resourceType === 'transfer') {
    yield put(actions.resource.requestCollection('integrations'));
    yield put(actions.resource.requestCollection('transfers'));
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
    yield put(actions.resource.requestCollection('transfers'));
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
    actionTypes.LICENSE_NUM_ENABLED_FLOWS_REQUEST
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

  yield put(actions.user.org.accounts.receivedNumEnabledFlows(response));
}
export function* requestLicenseEntitlementUsage() {
  const { path, opts } = getRequestOptions(
    actionTypes.LICENSE_ENTITLEMENT_USAGE_REQUEST
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

  yield put(actions.user.org.accounts.receivedLicenseEntitlementUsage(response));
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

export const userSagas = [
  takeLatest(actionTypes.UNLINK_WITH_GOOGLE, unlinkWithGoogle),
  takeLatest(actionTypes.UPDATE_PROFILE, updateProfile),
  takeLatest(actionTypes.UPDATE_PREFERENCES, updatePreferences),
  takeEvery(actionTypes.LICENSE_TRIAL_REQUEST, requestTrialLicense),
  takeEvery(actionTypes.LICENSE_UPGRADE_REQUEST, requestLicenseUpgrade),
  takeEvery(actionTypes.USER_CHANGE_EMAIL, changeEmail),
  takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
  takeEvery(actionTypes.ACCOUNT_LEAVE_REQUEST, leaveAccount),
  takeEvery(actionTypes.ACCOUNT_SWITCH, switchAccount),
  takeEvery(actionTypes.USER_CREATE, createUser),
  takeEvery(actionTypes.USER_UPDATE, updateUser),
  takeEvery(actionTypes.USER_DISABLE, disableUser),
  takeEvery(actionTypes.USER_DELETE, deleteUser),
  takeEvery(actionTypes.USER_MAKE_OWNER, makeOwner),
  takeEvery(actionTypes.DEFAULT_ACCOUNT_SET, requestSharedStackNotifications),
  takeEvery(actionTypes.SHARED_NOTIFICATION_ACCEPT, acceptSharedInvite),
  takeEvery(actionTypes.SHARED_NOTIFICATION_REJECT, rejectSharedInvite),
  takeEvery(
    actionTypes.LICENSE_ENTITLEMENT_USAGE_REQUEST,
    requestLicenseEntitlementUsage
  ),
  takeEvery(
    actionTypes.LICENSE_NUM_ENABLED_FLOWS_REQUEST,
    requestNumEnabledFlows
  ),
  takeLatest(actionTypes.LICENSE_UPDATE_REQUEST, requestLicenseUpdate),
  takeEvery(
    actionTypes.ACCOUNT_ADD_SUITESCRIPT_LINKED_CONNECTION,
    addSuiteScriptLinkedConnection
  ),
  takeEvery(
    actionTypes.ACCOUNT_DELETE_SUITESCRIPT_LINKED_CONNECTION,
    deleteSuiteScriptLinkedConnection
  ),
];
