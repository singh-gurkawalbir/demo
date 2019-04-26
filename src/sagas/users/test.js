/* global describe, test, expect */

import { call, put, select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers/index';
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
  acceptAccountInvite,
  rejectAccountInvite,
  switchAccount,
  leaveAccount,
} from './';
import { APIException } from '../api/index';

const status403 = new APIException({
  status: 403,
  message: 'User Forbidden action',
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
        })
      );

      expect(saga.next().value).toEqual(
        put(
          actions.api.complete(
            changePasswordParams.path,
            'Success!! Changed user password'
          )
        )
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
        })
      );

      expect(saga.throw(new Error()).value).toEqual(
        put(
          actions.api.failure(
            changePasswordParams.path,
            'Invalid credentials provided.  Please try again.'
          )
        )
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
        })
      );
      expect(saga.next().value).toEqual(
        put(
          actions.api.complete(
            changeEmailParams.path,
            'Success!! Sent user change Email setup to you email'
          )
        )
      );
    });

    test('should generate appropriate error message when user attempts to change an existing email', () => {
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
        })
      );

      expect(saga.throw(status403).value).toEqual(
        put(
          actions.api.failure(
            changeEmailParams.path,
            'Existing email provided, Please try again.'
          )
        )
      );
    });

    test('should generate appropriate error message for any other error', () => {
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
        })
      );

      expect(saga.throw(new Error()).value).toEqual(
        put(
          actions.api.failure(
            changeEmailParams.path,
            'Cannot change user Email , Please try again.'
          )
        )
      );
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
          select(selectors.userPreferences)
        );
        expect(saga.next(preferences).value).toEqual(
          call(apiCallWithRetry, {
            path: updatePreferencesParams.path,
            opts: { ...updatePreferencesParams.opts, body: preferences },
            message: "Updating user's info",
          })
        );
      });

      test('should generate the appropriate message failure in a api failure ', () => {
        const preferences = {
          timeFormat: 'something',
        };
        const saga = updatePreferences();

        expect(saga.next().value).toEqual(select(selectors.userPreferences));
        const payload = {
          ...updatePreferencesParams.opts,
          body: preferences,
        };

        expect(saga.next(preferences).value).toEqual(
          call(apiCallWithRetry, {
            path: updatePreferencesParams.path,
            opts: payload,
            message: "Updating user's info",
          })
        );

        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(
              updatePreferencesParams.path,
              'Could not update user Preferences'
            )
          )
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
          })
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
          })
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(
              updateProfileParams.path,
              'Could not update user Profile'
            )
          )
        );
      });
    });
    describe('accepting account share invite', () => {
      test('should update aShare successfuly', () => {
        const aShare = {
          id: 'something',
        };
        const saga = acceptAccountInvite(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/ashares/${aShare.id}/accept`,
            opts: { method: 'PUT', body: {} },
            message: 'Accepting account share invite',
          })
        );
        expect(saga.next().value).toEqual(
          put(actions.resource.requestCollection('shared/ashares'))
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = { id: 'something' };
        const saga = acceptAccountInvite(aShare);
        const path = `/ashares/${aShare.id}/accept`;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts: { method: 'PUT', body: {} },
            message: 'Accepting account share invite',
          })
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(path, 'Could not accept account share invite')
          )
        );
        expect(saga.next().done).toEqual(true);
      });
    });
    describe('rejecting account share invite', () => {
      test('should update aShare successfuly', () => {
        const aShare = {
          id: 'something',
        };
        const saga = rejectAccountInvite(aShare);

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path: `/ashares/${aShare.id}/dismiss`,
            opts: { method: 'PUT', body: {} },
            message: 'Rejecting account share invite',
          })
        );
        expect(saga.next().value).toEqual(
          put(actions.resource.requestCollection('shared/ashares'))
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = { id: 'something' };
        const saga = rejectAccountInvite(aShare);
        const path = `/ashares/${aShare.id}/dismiss`;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts: { method: 'PUT', body: {} },
            message: 'Rejecting account share invite',
          })
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(
            actions.api.failure(path, 'Could not reject account share invite')
          )
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
            environment: 'production',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: aShare.environment,
              })
            )
          );
          expect(saga.next().done).toEqual(true);
        });
        test('should switch to sandbox environment successfuly', () => {
          const aShare = {
            id: defaultAShareId,
            environment: 'sandbox',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: aShare.environment,
              })
            )
          );
          expect(saga.next().done).toEqual(true);
        });
      });
      describe('switching to a different account', () => {
        test('should switch to production environment successfuly', () => {
          const aShare = {
            id: 'somethingelse',
            environment: 'production',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: aShare.environment,
              })
            )
          );

          expect(saga.next().value).toEqual(put(actions.auth.clearStore()));
          expect(saga.next().value).toEqual(put(actions.auth.initSession()));
          expect(saga.next().done).toEqual(true);
        });
        test('should switch to sandbox environment successfuly', () => {
          const aShare = {
            id: 'somethingelse',
            environment: 'sandbox',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: aShare.environment,
              })
            )
          );

          expect(saga.next().value).toEqual(put(actions.auth.clearStore()));
          expect(saga.next().value).toEqual(put(actions.auth.initSession()));
          expect(saga.next().done).toEqual(true);
        });
      });
      describe('handling api error', () => {
        test('should generate appropriate error message in case of api failure', () => {
          const aShare = {
            id: 'somethingelse',
            environment: 'sandbox',
          };
          const saga = switchAccount(aShare);

          expect(saga.next().value).toEqual(select(selectors.userPreferences));
          expect(saga.next({ defaultAShareId }).value).toEqual(
            put(
              actions.user.preferences.update({
                defaultAShareId: aShare.id,
                environment: aShare.environment,
              })
            )
          );
          expect(saga.throw(new Error()).value).toEqual(
            put(
              actions.api.failure('switch account', 'Could not switch account')
            )
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
          })
        );

        expect(saga.next().value).toEqual(select(selectors.userPreferences));

        expect(saga.next({ defaultAShareId }).value).toEqual(
          put(actions.auth.clearStore())
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
          })
        );

        expect(saga.next().value).toEqual(select(selectors.userPreferences));

        expect(saga.next({ defaultAShareId }).value).toEqual(
          put(actions.resource.requestCollection('shared/ashares'))
        );
        expect(saga.next().done).toEqual(true);
      });
      test('should generate appropriate error message in case of api failure', () => {
        const aShare = {
          id: defaultAShareId,
        };
        const saga = leaveAccount(aShare);
        const path = `/shared/ashares/${aShare.id}`;

        expect(saga.next().value).toEqual(
          call(apiCallWithRetry, {
            path,
            opts: { method: 'DELETE', body: {} },
            message: 'Leaving account',
          })
        );
        expect(saga.throw(new Error()).value).toEqual(
          put(actions.api.failure(path, 'Could not leave account'))
        );
        expect(saga.next().done).toEqual(true);
      });
    });
  });
});
