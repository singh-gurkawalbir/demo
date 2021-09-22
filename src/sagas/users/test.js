/* global describe, test, expect */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, put, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  changePasswordParams,
  updatePreferencesParams,
  updateProfileParams,
  changeEmailParams,
} from '../api/apiPaths';
import {
  changePassword,
  changeEmail,
  updatePreferences,
  updateProfile,
  acceptSharedInvite,
  rejectSharedInvite,
  switchAccount,
  leaveAccount,
  createUser,
  updateUser,
  deleteUser,
  disableUser,
  makeOwner,
  requestTrialLicense,
  reinviteUser,
  unlinkWithGoogle,
  requestLicenseUpgrade,
  requestSharedStackNotifications,
} from '.';
import { APIException } from '../api/index';
import { USER_ACCESS_LEVELS, ACCOUNT_IDS } from '../../utils/constants';
import getRequestOptions from '../../utils/requestOptions';

const changeEmailError = new APIException({
  status: 403,
  message: 'Cannot change existing email id',
});

describe('all modal sagas', () => {
  describe('change password saga ', () => {
    test('Should update user password with correct user password in the db and also merge the data in the redux store', () => {
      const updatedPassword = {
        newPassword: 'abc',
        currentPassword: 'def',
      };
      const saga = changePassword({ updatedPassword });
      const apiCallEffect = saga.next().value;

      expect(apiCallEffect).toEqual(
        call(apiCallWithRetry, {
          path: changePasswordParams.path,
          opts: { ...changePasswordParams.opts, body: updatedPassword },
          message: "Changing user's password",
          hidden: true,
        }),
      );

      expect(saga.next().value).toEqual(
        put(
          actions.api.complete(
            changePasswordParams.path,
            changePasswordParams.opts.method,
            'Password changed.',
          ),
        ),
      );
    });

    test('should generate appropriate failure message for whatever reason', () => {
      const updatedPassword = {
        newPassword: 'abc',
        currentPassword: 'def',
      };
      const saga = changePassword({ updatedPassword });
      const apiCallEffect = saga.next().value;

      expect(apiCallEffect).toEqual(
        call(apiCallWithRetry, {
          path: changePasswordParams.path,
          opts: { ...changePasswordParams.opts, body: updatedPassword },
          message: "Changing user's password",
          hidden: true,
        }),
      );

      expect(saga.throw(new Error()).value).toEqual(
        put(
          actions.api.failure(
            changePasswordParams.path,
            changePasswordParams.opts.method,
            'Invalid credentials provided.  Please try again.',
            true,
          ),
        ),
      );
    });
  });
  describe('change user email saga', () => {
    test("should change user's Email and successfuly", () => {
      const updatedEmail = {
        newEmail: 'something@gmail.com',
        password: 'abc',
      };
      const saga = changeEmail({ updatedEmail });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: changeEmailParams.path,
          opts: { ...changeEmailParams.opts, body: updatedEmail },
          message: "Changing user's Email",
          hidden: true,
        }),
      );
      expect(saga.next().value).toEqual(
        put(
          actions.api.complete(
            changeEmailParams.path,
            changeEmailParams.opts.method,
            'Verification link sent to new email address.',
          ),
        ),
      );
    });

    test('should throw an error when the user attempts to change an existing email or with incorrect password', () => {
      const updatedEmail = {
        newEmail: 'something@gmail.com',
        password: 'abc',
      };
      const saga = changeEmail({ updatedEmail });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: changeEmailParams.path,
          opts: { ...changeEmailParams.opts, body: updatedEmail },
          message: "Changing user's Email",
          hidden: true,
        }),
      );
      saga.throw(changeEmailError);
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('update user and profile preferences sagas', () => {
    describe('update preferences saga', () => {
      test("should update user's preferences successfuly", () => {
        const preferences = {
          timeFormat: 'something',
        };
        const saga = updatePreferences({ preferences });

        expect(saga.next(preferences).value).toEqual(
          select(selectors.userOwnPreferences),
        );
        expect(saga.next(preferences).value).toEqual(
          call(apiCallWithRetry, {
            path: updatePreferencesParams.path,
            opts: { ...updatePreferencesParams.opts, body: preferences },
            message: "Updating user's info",
          }),
        );
      });

      test('should generate the appropriate message failure in a api failure ', () => {
        const preferences = {
          timeFormat: 'something',
        };
        const saga = updatePreferences();

        expect(saga.next().value).toEqual(select(selectors.userOwnPreferences));
        const payload = {
          ...updatePreferencesParams.opts,
          body: preferences,
        };

        expect(saga.next(preferences).value).toEqual(
          call(apiCallWithRetry, {
            path: updatePreferencesParams.path,
            opts: payload,
            message: "Updating user's info",
          }),
        );

        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(
              updatePreferencesParams.path,
              updatePreferencesParams.opts.method,
              'Could not update user Preferences',
            ),
          ),
        );
      });
    });
    describe('update profile saga', () => {
      test("should update user's profile successfuly", () => {
        const someProfile = {
          name: 'something',
        };
        const saga = updateProfile();

        expect(saga.next().value).toEqual(select(selectors.userProfile));

        expect(saga.next(someProfile).value).toEqual(
          call(apiCallWithRetry, {
            path: updateProfileParams.path,
            opts: { ...updateProfileParams.opts, body: someProfile },
            message: "Updating user's info",
          }),
        );
      });

      test('should generate the appropriate message failure in a api failure and not update the redux store', () => {
        const someProfile = {
          name: 'something',
        };
        const saga = updateProfile();

        expect(saga.next().value).toEqual(select(selectors.userProfile));

        expect(saga.next(someProfile).value).toEqual(
          call(apiCallWithRetry, {
            path: updateProfileParams.path,
            opts: { ...updateProfileParams.opts, body: someProfile },
            message: "Updating user's info",
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(
              updateProfileParams.path,
              updateProfileParams.opts.method,
              'Could not update user Profile',
            ),
          ),
        );
      });
    });
    describe('accepting account share invite', () => {
      test('should update aShare successfuly and reload shared/ashares when the default account is some shared account', () => {
        const aShare = {
          resourceType: 'account',
          id: 'something',
        };
        const saga = acceptSharedInvite(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/ashares/${aShare.id}/accept`,
            opts: { method: 'PUT', body: {} },
            message: 'Accepting account share invite',
          }),
        );
        expect(saga.next().value).toEqual(select(selectors.userPreferences));
        expect(
          saga.next({ defaultAShareId: 'SomeSharedAccount' }).value,
        ).toEqual(put(actions.resource.requestCollection('shared/ashares')));
        expect(saga.next().done).toEqual(true);
      });
      test('should update aShare successfuly and clear store and re-init session when the default account is own', () => {
        const aShare = {
          resourceType: 'account',
          id: 'something',
        };
        const saga = acceptSharedInvite(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/ashares/${aShare.id}/accept`,
            opts: { method: 'PUT', body: {} },
            message: 'Accepting account share invite',
          }),
        );
        expect(saga.next().value).toEqual(select(selectors.userPreferences));
        expect(saga.next({ defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
          put(actions.auth.clearStore()),
        );
        expect(saga.next().value).toEqual(put(actions.auth.initSession()));
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = { resourceType: 'account', id: 'something' };
        const saga = acceptSharedInvite(aShare);
        const path = `/ashares/${aShare.id}/accept`;
        const opts = { method: 'PUT', body: {} };

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Accepting account share invite',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('rejecting account share invite', () => {
      test('should update aShare successfuly', () => {
        const aShare = {
          resourceType: 'account',
          id: 'something',
        };
        const saga = rejectSharedInvite(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/ashares/${aShare.id}/dismiss`,
            opts: { method: 'PUT', body: {} },
            message: 'Rejecting account share invite',
          }),
        );
        expect(saga.next().value).toEqual(
          put(actions.resource.requestCollection('shared/ashares')),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = { resourceType: 'account', id: 'something' };
        const saga = rejectSharedInvite(aShare);
        const path = `/ashares/${aShare.id}/dismiss`;
        const opts = { method: 'PUT', body: {} };

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Rejecting account share invite',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(
              path,
              opts.method,
              'Could not reject account share invite',
            ),
          ),
        );
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('switching account', () => {
      const defaultAShareId = 'something';

      describe('switching to the same account, different environment', () => {
        test('should switch to production environment successfuly', () => {
          const aShare = {
            id: defaultAShareId,
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: 'production',
              }),
            ),
          );
          expect(saga.next().done).toEqual(true);
        });
        test('should switch to sandbox environment successfuly', () => {
          const aShare = {
            id: defaultAShareId,
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: 'production',
              }),
            ),
          );
          expect(saga.next().done).toEqual(true);
        });
      });
      describe('switching to a different account', () => {
        test('should switch to production environment successfuly', () => {
          const aShare = {
            id: 'somethingelse',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(actions.auth.abortAllSagasAndSwitchAcc(aShare.id))
          );

          expect(saga.next().done).toEqual(true);
        });
        test('should switch to sandbox environment successfuly', () => {
          const aShare = {
            id: 'somethingelse',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));

          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(actions.auth.abortAllSagasAndSwitchAcc(aShare.id))
          );
          expect(saga.next().done).toEqual(true);
        });
      });
    });
    describe('leaving account', () => {
      const defaultAShareId = 'something';

      test('should leave the default account successfuly', () => {
        const aShare = {
          id: defaultAShareId,
        };
        const saga = leaveAccount(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/shared/ashares/${aShare.id}`,
            opts: { method: 'DELETE', body: {} },
            message: 'Leaving account',
          }),
        );

        expect(saga.next().value).toEqual(select(selectors.userPreferences));

        expect(saga.next({ defaultAShareId }).value).toEqual(
          put(actions.auth.clearStore()),
        );
        expect(saga.next().value).toEqual(put(actions.auth.initSession()));
        expect(saga.next().done).toEqual(true);
      });

      test('should leave the non-default account successfuly', () => {
        const aShare = {
          id: 'somethingelse',
        };
        const saga = leaveAccount(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/shared/ashares/${aShare.id}`,
            opts: { method: 'DELETE', body: {} },
            message: 'Leaving account',
          }),
        );

        expect(saga.next().value).toEqual(select(selectors.userPreferences));

        expect(saga.next({ defaultAShareId }).value).toEqual(
          put(actions.resource.requestCollection('shared/ashares')),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = {
          id: defaultAShareId,
        };
        const saga = leaveAccount(aShare);
        const path = `/shared/ashares/${aShare.id}`;
        const opts = { method: 'DELETE', body: {} };

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Leaving account',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(actions.api.failure(path, opts.method, 'Could not leave account')),
        );
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('integrator license trial & upgrade requests', () => {
      test('should start trial successfully', () => {
        const saga = requestTrialLicense();
        const requestOptions = getRequestOptions(
          actionTypes.LICENSE_TRIAL_REQUEST,
        );
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Requesting trial license',
          }),
        );
        const response = {
          _id: 'something',
          trialEndDate: new Date().toISOString(),
        };

        expect(saga.next(response).value).toEqual(
          put(actions.user.org.accounts.trialLicenseIssued(response)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while starting license trial', () => {
        const saga = requestTrialLicense();
        const requestOptions = getRequestOptions(
          actionTypes.LICENSE_TRIAL_REQUEST,
        );
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Requesting trial license',
          }),
        );

        expect(saga.throw(new Error()).value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('create/invite user', () => {
      test('should create user successfully', () => {
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const response = { _id: 'something' };
        const saga = createUser({ user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER_CREATE);
        const { path, opts } = requestOptions;

        opts.body = user;
        expect(saga.next().value).toEqual(
          put(actions.asyncTask.start('asyncKey'))
        );
        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Inviting User',
          }),
        );
        expect(saga.next(response).value).toEqual(
          put(actions.asyncTask.success('asyncKey')));

        expect(saga.next(response).value).toEqual(
          put(actions.user.org.users.created(response)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while creating user', () => {
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const saga = createUser({ user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER_CREATE);
        const { path, opts } = requestOptions;

        opts.body = user;
        expect(saga.next().value).toEqual(
          put(actions.asyncTask.start('asyncKey'))
        );
        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Inviting User',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(put(actions.asyncTask.failed('asyncKey')));
        expect(saga.next().value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('update user', () => {
      test('should update user successfully', () => {
        const userId = 'something';
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const response = { _id: 'something' };
        const saga = updateUser({ _id: userId, user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER_UPDATE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        opts.body = user;
        expect(saga.next().value).toEqual(
          put(actions.asyncTask.start('asyncKey'))
        );
        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Updating User',
          }),
        );
        expect(saga.next(response).value).toEqual(
          put(actions.asyncTask.success('asyncKey')));

        expect(saga.next(response).value).toEqual(
          put(actions.user.org.users.updated({ ...user, _id: userId})),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while updating user', () => {
        const userId = 'something';
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const saga = updateUser({ _id: userId, user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER_UPDATE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        opts.body = user;
        expect(saga.next().value).toEqual(
          put(actions.asyncTask.start('asyncKey'))
        );
        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Updating User',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(put(actions.asyncTask.failed('asyncKey')));
        expect(saga.next().value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('delete user', () => {
      test('should delete user successfully', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER_DELETE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Deleting User',
            hidden: true,
          }),
        );
        expect(saga.next({}).value).toEqual(
          put(actions.user.org.users.deleted(userId)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while deleting user', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER_DELETE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Deleting User',
            hidden: true,
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('disable user', () => {
      test('should disable user successfully', () => {
        const userId = 'something';
        const disabled = false;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER_DISABLE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Disabling User',
          }),
        );
        expect(saga.next({}).value).toEqual(
          put(actions.user.org.users.disabled(userId)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should enable user successfully', () => {
        const userId = 'something';
        const disabled = true;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER_DISABLE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Enabling User',
          }),
        );
        expect(saga.next({}).value).toEqual(
          put(actions.user.org.users.disabled(userId)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while disabling user', () => {
        const userId = 'something';
        const disabled = false;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER_DISABLE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Disabling User',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('making an user as owner', () => {
      test('should request account transfer successfully', () => {
        const email = 'something@something.com';
        const saga = makeOwner({ email });
        const requestOptions = getRequestOptions(actionTypes.USER_MAKE_OWNER);
        const { path, opts } = requestOptions;

        opts.body = { email, account: true };

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Requesting account transfer',
            hidden: true,
          }),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while requesting an account transfer', () => {
        const email = 'something@something.com';
        const saga = makeOwner({ email });
        const requestOptions = getRequestOptions(actionTypes.USER_MAKE_OWNER);
        const { path, opts } = requestOptions;

        opts.body = { email, account: true };

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Requesting account transfer',
            hidden: true,
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(true);
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('reinviteUser user', () => {
      test('should reinvite user successfully', () => {
        const userId = 'something';
        const saga = reinviteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER_REINVITE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Reinviting User',
          }),
        );
        expect(saga.next({}).value).toEqual(
          put(actions.user.org.users.reinvited(userId)),
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should handle api error properly while reinviting user', () => {
        const userId = 'something';
        const saga = reinviteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER_REINVITE, {
          resourceId: userId,
        });
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            message: 'Reinviting User',
          }),
        );
        expect(saga.throw(new Error()).value).toEqual(put(actions.user.org.users.reinviteError(userId)));
        expect(saga.next().done).toEqual(true);
      });
    });
  });
  describe('unlinkWithGoogle saga', () => {
    const path = '/unlink/google';
    const method = 'post';

    test('should succeed on successful api call', () => expectSaga(unlinkWithGoogle)
      .provide([
        [matchers.call.fn(apiCallWithRetry), {}],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.user.profile.unlinkedWithGoogle())
      .run());
    test('should handle api error properly', () => {
      const error = new Error('error');

      return expectSaga(unlinkWithGoogle)
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.api.failure(path, method, 'Could not unlink with Google'))
        .run();
    });
  });
  describe('requestLicenseUpgrade saga', () => {
    const response = {
      _id: 'something',
    };

    test('should succeed on successful api call', () => expectSaga(requestLicenseUpgrade)
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.user.org.accounts.licenseUpgradeRequestSubmitted(response))
      .run());
    test('should handle api error properly', () => {
      const error = new Error('error');

      return expectSaga(requestLicenseUpgrade)
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .returns(true)
        .run();
    });
  });
  describe('requestSharedStackNotifications saga', () => {
    const response1 = {
      defaultAShareId: ACCOUNT_IDS.OWN,
    };
    const response2 = {
      defaultAShareId: 'admin',
    };

    test('should handle if it is account owner', () => expectSaga(requestSharedStackNotifications)
      .provide([
        [select(selectors.userPreferences), response1],
      ])
      .put(actions.resource.requestCollection('shared/sshares'))
      .run());
    test('should handle if it is not account owner', () => expectSaga(requestSharedStackNotifications)
      .provide([
        [select(selectors.userPreferences), response2],
      ])
      .run());
  });
});
