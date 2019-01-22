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
  updatePreferencesToAccount,
} from './';
import { status403 } from '../test';

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
        call(
          apiCallWithRetry,
          changePasswordParams.path,
          { ...changePasswordParams.opts, body: updatedPassword },
          "Changing user's password",
          true
        )
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
        call(
          apiCallWithRetry,
          changePasswordParams.path,
          { ...changePasswordParams.opts, body: updatedPassword },
          "Changing user's password",
          true
        )
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
        call(
          apiCallWithRetry,
          changeEmailParams.path,
          { ...changeEmailParams.opts, body: updatedEmail },
          "Changing user's Email",
          true
        )
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
        call(
          apiCallWithRetry,
          changeEmailParams.path,
          { ...changeEmailParams.opts, body: updatedEmail },
          "Changing user's Email",
          true
        )
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
        call(
          apiCallWithRetry,
          changeEmailParams.path,
          { ...changeEmailParams.opts, body: updatedEmail },
          "Changing user's Email",
          true
        )
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
  describe('updatePreferencesToAccount saga', () => {
    describe("should generate appropriate update payload into the user's prefereces", () => {
      test(`for user accounts whom havent invited users to access their account`, () => {
        const preferences = {
          timeFormat: 'something',
          themeName: 'light',
        };
        const saga = updatePreferencesToAccount(preferences);
        const origPreferencesData = {
          dateFormat: 'original date format',
          timeFormat: 'original time format',
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          select(selectors.userOrigPreferences)
        );
        const expectedMergedPreferences = {
          dateFormat: 'original date format',
          timeFormat: 'something',
          themeName: 'light',
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          expectedMergedPreferences
        );
      });

      test(`for user accounts whom are owners`, () => {
        const preferences = {
          timeFormat: 'something',
          themeName: 'light',
        };
        const saga = updatePreferencesToAccount(preferences);
        const origPreferencesData = {
          defaultAShareId: 'own',
          timeFormat: 'original time format',
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          select(selectors.userOrigPreferences)
        );
        const expectedMergedPreferences = {
          timeFormat: 'something',
          themeName: 'light',
          defaultAShareId: 'own',
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          expectedMergedPreferences
        );
      });

      test(`for user accounts whom are owners with accepeted invited users`, () => {
        const preferences = {
          timeFormat: 'something',
          themeName: 'dark',
        };
        const saga = updatePreferencesToAccount(preferences);
        const origPreferencesData = {
          defaultAShareId: '134',
          timeFormat: 'original time format',
          accounts: {
            '134': {
              themeName: 'light',
            },
            '24343': {
              themeName: 'dark',
            },
          },
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          select(selectors.userOrigPreferences)
        );
        const expectedMergedPreferences = {
          timeFormat: 'something',
          defaultAShareId: '134',
          accounts: {
            '134': {
              themeName: 'dark',
            },
            '24343': {
              themeName: 'dark',
            },
          },
        };

        expect(saga.next(origPreferencesData).value).toEqual(
          expectedMergedPreferences
        );
      });
    });
  });
  describe('update user and profile preferences sagas', () => {
    describe('update preferences saga', () => {
      test('shoulde exit the saga when no preferences updates are required', () => {
        const saga = updatePreferences({});

        expect(saga.next().done).toEqual(true);
      });
      test("should update user's preferences successfuly", () => {
        const preferences = {
          timeFormat: 'something',
        };
        const saga = updatePreferences({ preferences });

        expect(saga.next().value).toEqual(
          call(updatePreferencesToAccount, preferences)
        );
        expect(saga.next(preferences).value).toEqual(
          call(
            apiCallWithRetry,
            updatePreferencesParams.path,
            { ...updatePreferencesParams.opts, body: preferences },
            "Updating user's info"
          )
        );
        expect(saga.next().value).toEqual(
          put(actions.profile.updatePreferenceStore(preferences))
        );
      });

      test('should generate the appropriate message failure in a api failure and not update the redux store', () => {
        const preferences = {
          timeFormat: 'something',
        };
        const saga = updatePreferences({ preferences });

        expect(saga.next().value).toEqual(
          call(updatePreferencesToAccount, preferences)
        );

        expect(saga.next(preferences).value).toEqual(
          call(
            apiCallWithRetry,
            updatePreferencesParams.path,
            { ...updatePreferencesParams.opts, body: preferences },
            "Updating user's info"
          )
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
        const saga = updateProfile(someProfile);

        expect(saga.next().value).toEqual(
          call(
            apiCallWithRetry,
            updateProfileParams.path,
            { ...updateProfileParams.opts, body: someProfile },
            "Updating user's info"
          )
        );

        expect(saga.next().value).toEqual(
          put(actions.resource.received('profile', someProfile))
        );
      });

      test('should generate the appropriate message failure in a api failure and not update the redux store', () => {
        const someProfile = {
          name: 'something',
        };
        const saga = updateProfile(someProfile);

        expect(saga.next().value).toEqual(
          call(
            apiCallWithRetry,
            updateProfileParams.path,
            { ...updateProfileParams.opts, body: someProfile },
            "Updating user's info"
          )
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
  });
});
