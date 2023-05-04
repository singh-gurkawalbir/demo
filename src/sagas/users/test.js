
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
  requestLicenseUpdate,
  requestNumEnabledFlows,
  requestLicenseEntitlementUsage,
  addSuiteScriptLinkedConnection,
  deleteSuiteScriptLinkedConnection,
  refreshLicensesCollection,
  switchAccountActions,
} from '.';
import { USER_ACCESS_LEVELS, ACCOUNT_IDS } from '../../constants';
import getRequestOptions from '../../utils/requestOptions';
import { APIException } from '../api/requestInterceptors/utils';
import { getResourceCollection } from '../resources';
import { checkAndUpdateDefaultSetId } from '../authentication';

const changeEmailError = new APIException({
  status: 403,
  message: 'Cannot change existing email id',
});

describe('all modal sagas', () => {
  describe('change password saga', () => {
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

    test('should dispatch api failure action with general message if api call fails and not able to generate appropiate error message', () => {
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

    test('should dispatch api failure action with generated message if api call fails and able to generate appropiate error message', () => {
      const updatedPassword = {
        newPassword: 'abc',
        currentPassword: 'def',
      };
      const args = {
        path: changePasswordParams.path,
        opts: { ...changePasswordParams.opts, body: updatedPassword },
        message: "Changing user's password",
        hidden: true,
      };
      const error = {
        message: '{"errors": [{"message": "some error message"}]}',
      };
      const { errors } = JSON.parse(error.message);
      const errorMsg = errors[0].message;

      expectSaga(changePassword, { updatedPassword })
        .provide([
          [call(apiCallWithRetry, args), throwError(error)],
        ])
        .put(
          actions.api.failure(
            changePasswordParams.path,
            changePasswordParams.opts.method,
            errorMsg,
            true,
          ),
        )
        .run();
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
      expect(saga.next().done).toBe(true);
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

      test('should generate the appropriate message failure in a api failure', () => {
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
      const sharedResourceTypeMap = {
        account: 'ashares',
        stack: 'sshares',
        transfer: 'transfers',
      };

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
        expect(saga.next().done).toBe(true);
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
        expect(saga.next({ resourceType: 'account', defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
          put(actions.user.preferences.update({
            defaultAShareId: 'something',
            environment: 'production',
          }, true)),
        );
        expect(saga.next({ resourceType: 'account', defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
          call(updatePreferences),
        );
        expect(saga.next({ resourceType: 'account', defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
          put(actions.auth.clearStore({ authenticated: true })),
        );
        expect(saga.next().value).toEqual(put(actions.auth.initSession()));
        expect(saga.next().done).toBe(true);
      });
      test('should update aShare successfully and accept account transfer if resource is a transfer and invite is an accountTransfer', () => {
        const resourceType = 'transfer';
        const id = 'something';
        const isAccountTransfer = true;
        const args = {
          path: `/${sharedResourceTypeMap[resourceType]}/${id}/accept`,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: `Accepting ${resourceType} share invite`,
        };
        const userPreferences = {
          defaultAShareId: 'own',
        };

        expectSaga(acceptSharedInvite, { resourceType, id, isAccountTransfer})
          .provide([
            [call(apiCallWithRetry, args)],
            [select(selectors.userPreferences), userPreferences],
          ])
          .put(actions.app.userAcceptedAccountTransfer())
          .run();
      });
      test('should update aShare successfuly and update resources collection if resource is transfer and it is not an accountTransfer', () => {
        const resourceType = 'transfer';
        const id = 'something';
        const isAccountTransfer = false;
        const args = {
          path: `/${sharedResourceTypeMap[resourceType]}/${id}/accept`,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: `Accepting ${resourceType} share invite`,
        };
        const userPreferences = {
          defaultAShareId: 'own',
        };

        expectSaga(acceptSharedInvite, { resourceType, id, isAccountTransfer})
          .provide([
            [call(apiCallWithRetry, args)],
            [select(selectors.userPreferences), userPreferences],
          ])
          .put(actions.resource.requestCollection('integrations'))
          .put(actions.resource.requestCollection('transfers'))
          .put(actions.resource.requestCollection('tiles'))
          .put(actions.resource.requestCollection('connections'))
          .run();
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
        expect(saga.throw(new Error()).value).toBe(true);
        expect(saga.next().done).toBe(true);
      });
    });
    describe('rejecting account share invite', () => {
      test('should update aShare successfuly if resourceType is an account or stack', () => {
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
        expect(saga.next().done).toBe(true);
      });
      test('should update aShare successfuly and update resource collection if the account is own and resourcetype is a transfer', () => {
        const resourceType = 'transfer';
        const id = 'something';
        const permissions = {
          accessLevel: 'owner',
        };
        const args = {
          path: `/transfers/${id}/dismiss`,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: `Rejecting ${resourceType} share invite`,
        };

        expectSaga(rejectSharedInvite, { resourceType, id })
          .provide([
            [call(apiCallWithRetry, args)],
            [select(selectors.resourcePermissions), permissions],
          ])
          .call(apiCallWithRetry, args)
          .put(actions.resource.requestCollection('transfers'))
          .run();
      });
      test('should update aShare successfuly and update resource collection if the account is not own', () => {
        const resourceType = 'transfer';
        const id = 'something';
        const permissions = {
          accessLevel: 'administrator',
        };
        const args = {
          path: `/transfers/${id}/dismiss`,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: `Rejecting ${resourceType} share invite`,
        };

        expectSaga(rejectSharedInvite, { resourceType, id })
          .provide([
            [call(apiCallWithRetry, args)],
            [select(selectors.resourcePermissions), permissions],
          ])
          .call(apiCallWithRetry, args)
          .put(actions.resource.requestCollection('transfers/invited'))
          .run();
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
        expect(saga.next().done).toBe(true);
      });
    });
    describe('switching account', () => {
      const defaultAShareId = 'something';

      describe('switching to a different account', () => {
        test('should switch to production environment successfuly', () => {
          const aShare = {
            preferences: {
              defaultAShareId: 'somethingelse',
            },
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(call(updatePreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(actions.auth.abortAllSagasAndSwitchAcc(aShare.preferences.defaultAShareId))
          );

          expect(saga.next().done).toBe(true);
        });
      });
    });
    describe('leaving account', () => {
      const defaultAShareId = 'something';

      test('should leave the default account successfuly', () => {
        const aShare = {
          id: defaultAShareId,
          isSwitchAccount: true,
        };
        const saga = leaveAccount(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/shared/ashares/${aShare.id}`,
            opts: { method: 'DELETE', body: {} },
            message: 'Leaving account',
          }),
        );

        expect(saga.next({}).value).toEqual(call(switchAccountActions));
        expect(saga.next().done).toBe(true);
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

        expect(saga.next({}).value).toEqual(
          put(actions.resource.requestCollection('shared/ashares')),
        );
        expect(saga.next().done).toBe(true);
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
        expect(saga.next().done).toBe(true);
      });
    });
    describe('integrator license trial & upgrade requests', () => {
      test('should start trial successfully', () => {
        const saga = requestTrialLicense();
        const requestOptions = getRequestOptions(
          actionTypes.LICENSE.TRIAL_REQUEST,
        );
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            hidden: true,
            message: 'Requesting trial license',
          }),
        );
        const response = {
          _id: 'something',
          trialEndDate: new Date().toISOString(),
        };

        expect(saga.next(response).value).toEqual(
          put(actions.license.trialLicenseIssued(response)),
        );
        expect(saga.next().value).toEqual(
          call(getResourceCollection, {
            resourceType: 'licenses',
            refresh: true,
          }),
        );
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while starting license trial', () => {
        const saga = requestTrialLicense();
        const requestOptions = getRequestOptions(
          actionTypes.LICENSE.TRIAL_REQUEST,
        );
        const { path, opts } = requestOptions;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts,
            hidden: true,
            message: 'Requesting trial license',
          }),
        );

        expect(saga.throw(new Error()).value).toBe(true);
        expect(saga.next().done).toBe(true);
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
        const requestOptions = getRequestOptions(actionTypes.USER.CREATE);
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
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while creating user', () => {
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const saga = createUser({ user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER.CREATE);
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
        expect(saga.next().value).toBe(true);
        expect(saga.next().done).toBe(true);
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
        const requestOptions = getRequestOptions(actionTypes.USER.UPDATE, {
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
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while updating user', () => {
        const userId = 'something';
        const user = {
          email: 'something@something.com',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        };
        const saga = updateUser({ _id: userId, user, asyncKey: 'asyncKey' });
        const requestOptions = getRequestOptions(actionTypes.USER.UPDATE, {
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
        expect(saga.next().value).toBe(true);
        expect(saga.next().done).toBe(true);
      });
    });
    describe('delete user', () => {
      test('should delete user successfully', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER.DELETE, {
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
          put(actions.user.org.users.deleted(userId))
        );
        expect(saga.next().done).toBe(true);
      });
      test('should delete user successfully when deleted user and deleting user is same', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId, isSwitchAccount: true });
        const requestOptions = getRequestOptions(actionTypes.USER.DELETE, {
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
          call(switchAccountActions)
        );
        expect(saga.next().value).toEqual(
          put(actions.user.org.users.deleted(userId))
        );
        expect(saga.next().done).toBe(true);
      });
      test('should delete user where the deleting user = selected user successfully', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId, isSwitchAccount: true});
        const requestOptions = getRequestOptions(actionTypes.USER.DELETE, {
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
          call(switchAccountActions)
        );
        expect(saga.next().value).toEqual(
          put(actions.user.org.users.deleted(userId))
        );
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while deleting user', () => {
        const userId = 'something';
        const saga = deleteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER.DELETE, {
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
        expect(saga.throw(new Error()).value).toBe(true);
        expect(saga.next().done).toBe(true);
      });
    });
    describe('disable user', () => {
      test('should disable user successfully', () => {
        const userId = 'something';
        const disabled = false;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER.DISABLE, {
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
        expect(saga.next().done).toBe(true);
      });

      test('should shared user disables his own user successfully', () => {
        const userId = 'something';
        const disabled = false;
        const saga = disableUser({ _id: userId, disabled, isSwitchAccount: true });
        const requestOptions = getRequestOptions(actionTypes.USER.DISABLE, {
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
          call(switchAccountActions),
        );
        expect(saga.next().value).toEqual(
          put(actions.user.org.users.disabled(userId)),
        );
        expect(saga.next().done).toBe(true);
      });
      test('should enable user successfully', () => {
        const userId = 'something';
        const disabled = true;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER.DISABLE, {
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
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while disabling user', () => {
        const userId = 'something';
        const disabled = false;
        const saga = disableUser({ _id: userId, disabled });
        const requestOptions = getRequestOptions(actionTypes.USER.DISABLE, {
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
        expect(saga.throw(new Error()).value).toBe(true);
        expect(saga.next().done).toBe(true);
      });
    });
    describe('making an user as owner', () => {
      test('should request account transfer successfully', () => {
        const email = 'something@something.com';
        const saga = makeOwner({ email });
        const requestOptions = getRequestOptions(actionTypes.USER.MAKE_OWNER);
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
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while requesting an account transfer', () => {
        const email = 'something@something.com';
        const saga = makeOwner({ email });
        const requestOptions = getRequestOptions(actionTypes.USER.MAKE_OWNER);
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
        expect(saga.throw(new Error()).value).toBe(true);
        expect(saga.next().done).toBe(true);
      });
    });
    describe('reinviteUser user', () => {
      test('should reinvite user successfully', () => {
        const userId = 'something';
        const saga = reinviteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER.REINVITE, {
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
        expect(saga.next().done).toBe(true);
      });
      test('should handle api error properly while reinviting user', () => {
        const userId = 'something';
        const saga = reinviteUser({ _id: userId });
        const requestOptions = getRequestOptions(actionTypes.USER.REINVITE, {
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
        expect(saga.next().done).toBe(true);
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

      expectSaga(unlinkWithGoogle)
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
      .put(actions.license.licenseUpgradeRequestSubmitted(response))
      .run());
    test('should handle api error properly', () => {
      const error = new Error('error');

      expectSaga(requestLicenseUpgrade)
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
  describe('requestLicenseUpdate saga', () => {
    const connectorId = 'c1';
    const licenseId = 'l1';

    test('should handle if it is actionType of ioResume', () => {
      const actionType = 'ioResume';
      const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPDATE_REQUEST, {
        actionType, connectorId, licenseId,
      });

      expectSaga(requestLicenseUpdate, { actionType, connectorId, licenseId})
        .provide([
          [matchers.call.fn(apiCallWithRetry)],
        ])
        .call.like({fn: apiCallWithRetry,
          args: [{
            path,
            opts,
          }]})
        .put(actions.resource.requestCollection('integrations'))
        .put(actions.resource.requestCollection('flows'))
        .put(actions.resource.requestCollection('exports'))
        .put(actions.resource.requestCollection('imports'))
        .put(actions.license.refreshCollection())
        .not.put(actions.license.licenseUpgradeRequestSubmitted({}))
        .run();
    });
    test('should handle if it is actionType is not ioResume', () => {
      const actionType = 'trial';
      const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPDATE_REQUEST, {
        actionType, connectorId, licenseId,
      });
      const response = {
        key: 'something',
      };

      expectSaga(requestLicenseUpdate, { actionType, connectorId, licenseId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call.like({fn: apiCallWithRetry,
          args: [{
            path,
            opts,
          }]})
        .not.put(actions.resource.requestCollection('integrations'))
        .put(actions.license.licenseUpgradeRequestSubmitted(response))
        .run();
    });
    test('should handle if it is actionType of upgrade and feature is sso', () => {
      const actionType = 'upgrade';
      const feature = 'SSO';
      const response = {
        key: 'something',
      };
      const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPDATE_REQUEST, {
        actionType, feature,
      });

      expectSaga(requestLicenseUpdate, { actionType, feature })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call.like({fn: apiCallWithRetry,
          args: [{
            path,
            opts,
          }]})
        .not.put(actions.resource.requestCollection('integrations'))
        .put(actions.license.licenseUpgradeRequestSubmitted(response, feature))
        .run();
    });
    test('should handle if apiCallWithRetry fails', () => {
      const actionType = 'trial';
      const { path, opts } = getRequestOptions(actionTypes.LICENSE.UPDATE_REQUEST, {
        actionType, connectorId, licenseId,
      });
      const error = {
        key: 'something',
      };

      expectSaga(requestLicenseUpdate, { actionType, connectorId, licenseId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.like({fn: apiCallWithRetry,
          args: [{
            path,
            opts,
          }]})
        .put(actions.api.failure(path, 'POST', error, false))
        .not.put(actions.resource.requestCollection('integrations'))
        .not.put(actions.license.licenseUpgradeRequestSubmitted({}))
        .run();
    });
  });
  describe('requestNumEnabledFlows saga', () => {
    const { path, opts } = getRequestOptions(
      actionTypes.LICENSE.NUM_ENABLED_FLOWS_REQUEST
    );
    const response = {
      key: 'something',
    };
    const error = { code: 422, message: 'error occured' };

    test('Should update receivedNumEnabledFlows, On successful api call', () => expectSaga(requestNumEnabledFlows)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), response],
      ])
      .put(actions.license.receivedNumEnabledFlows(response))
      .run()
    );
    test('Should dispatch api failure if api call fails', () => expectSaga(requestNumEnabledFlows)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), throwError(error)],
      ])
      .put(actions.api.failure(path, 'GET', error, false))
      .run()
    );
  });
  describe('requestLicenseEntitlementUsage saga', () => {
    const { path, opts } = getRequestOptions(
      actionTypes.LICENSE.ENTITLEMENT_USAGE_REQUEST
    );
    const response = {
      key: 'something',
    };
    const error = { code: 422, message: 'error occured' };

    test('Should update receivedLicenseEntitlementUsage, On successful api call', () => expectSaga(requestLicenseEntitlementUsage)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), response],
      ])
      .put(actions.license.receivedLicenseEntitlementUsage(response))
      .run()
    );
    test('Should dispatch api failure if api call fails', () => expectSaga(requestLicenseEntitlementUsage)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), throwError(error)],
      ])
      .put(actions.api.failure(path, 'GET', error.message, false))
      .run()
    );
  });
  describe('addSuiteScriptLinkedConnection saga', () => {
    const connectionId = 'c1';
    const path = `/preferences/ssConnectionIds/${connectionId}`;
    const opts = { method: 'PUT', body: {} };
    const response = {
      key: 'something',
    };
    const error = { code: 422, message: 'error occured' };

    test('Should update ashares resource, On successful api call', () => expectSaga(addSuiteScriptLinkedConnection, {connectionId})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), response],
      ])
      .put(actions.resource.requestCollection('shared/ashares'))
      .run()
    );
    test('Should dispatch api failure if api call fails', () => expectSaga(addSuiteScriptLinkedConnection, {connectionId})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), throwError(error)],
      ])
      .put(
        actions.api.failure(
          path,
          opts.method,
          'Could not link suitescript integrator'
        )
      )
      .run()
    );
  });
  describe('deleteSuiteScriptLinkedConnection saga', () => {
    const connectionId = 'c1';
    const path = `/preferences/ssConnectionIds/${connectionId}`;
    const opts = { method: 'DELETE', body: {} };
    const response = {
      key: 'something',
    };
    const error = { code: 422, message: 'error occured' };

    test('Should update ashares resource, On successful api call', () => expectSaga(deleteSuiteScriptLinkedConnection, {connectionId})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), response],
      ])
      .put(actions.resource.requestCollection('shared/ashares'))
      .run()
    );
    test('Should dispatch api failure if api call fails', () => expectSaga(deleteSuiteScriptLinkedConnection, {connectionId})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts,
        }), throwError(error)],
      ])
      .put(
        actions.api.failure(
          path,
          opts.method,
          'Could not unlink suitescript integrator'
        )
      )
      .run()
    );
  });
  describe('refreshLicensesCollection saga', () => {
    test('should dispatch request collection of ashares if it is a shared account', () => expectSaga(refreshLicensesCollection)
      .provide([
        [select(selectors.defaultAShareId), 'someAshareId'],
      ])
      .put(actions.resource.requestCollection('shared/ashares'))
      .not.put(actions.resource.requestCollection('licenses'))
      .run()
    );
    test('should dispatch request collection of licenses if there is no ashareId', () => expectSaga(refreshLicensesCollection)
      .provide([
        [select(selectors.defaultAShareId)],
      ])
      .not.put(actions.resource.requestCollection('shared/ashares'))
      .put(actions.resource.requestCollection('licenses'))
      .run()
    );
    test('should dispatch request collection of licenses if the ashareId is own', () => expectSaga(refreshLicensesCollection)
      .provide([
        [select(selectors.defaultAShareId), 'own'],
      ])
      .not.put(actions.resource.requestCollection('shared/ashares'))
      .put(actions.resource.requestCollection('licenses'))
      .run()
    );
  });

  describe('switchAccountActions saga', () => {
    test('should dispatch request collection of ashares if it is a shared account', () => expectSaga(switchAccountActions)
      .provide([
        [call(checkAndUpdateDefaultSetId)],
      ])
      .put(actions.auth.clearStore({ authenticated: true }))
      .put(actions.auth.initSession({ switchAcc: true }))
      .run()
    );
  });
});
