/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';

describe('user reducers', () => {
  describe('profile reducers', () => {
    const someTestProfile1 = { name: 'profile 1' };
    const someTestProfile2 = { name: 'profile 2' };

    test('when profile resource request is received should get resource message', () => {
      const state = reducer(
        undefined,
        actions.resource.received('profile', someTestProfile1)
      );

      expect(state).toEqual(someTestProfile1);
    });

    test('should replace existing profile with a new one.', () => {
      let state;

      state = reducer(
        state,
        actions.resource.received('profile', someTestProfile1)
      );
      expect(state).toEqual(someTestProfile1);

      state = reducer(
        state,
        actions.resource.received('profile', someTestProfile2)
      );
      expect(state).toEqual(someTestProfile2);
    });

    test('when delete profile action is dispatched wipe out user profile info except for the user email , user auth type google info and user auth type sso info', () => {
      const actionWithAuthTypes = {
        type: actionTypes.RESOURCE.RECEIVED,
        resourceType: 'profile',
        resource: {
          email: 'someemail@gmail.com',
          userName: 'abcd',
          auth_type_google: {id: '1234', email: 'someemail11@gmail.com'},
          authTypeSSO: { _ssoClientId: '5678', name: 'sso test', sub: 'id234'},
        },
      };
      const initialProfileState = reducer(undefined, actionWithAuthTypes);
      const state = reducer(initialProfileState, actions.user.profile.delete());

      expect(state).toEqual({
        email: actionWithAuthTypes.resource.email,
        auth_type_google: actionWithAuthTypes.resource.auth_type_google,
        authTypeSSO: actionWithAuthTypes.resource.authTypeSSO,
      });
      const actionWithoutAuthTypes = {
        type: actionTypes.RESOURCE.RECEIVED,
        resourceType: 'profile',
        resource: {
          email: 'someemail@gmail.com',
          userName: 'abcd',
        },
      };
      const initialProfileState2 = reducer(undefined, actionWithoutAuthTypes);
      const state2 = reducer(initialProfileState2, actions.user.profile.delete());

      expect(state2).toEqual({
        email: actionWithoutAuthTypes.resource.email,
        auth_type_google: undefined,
        authTypeSSO: undefined,
      });
    });
    test('when unlink with google request is received, clear auth type google info', () => {
      const action = {
        type: actionTypes.UNLINKED_WITH_GOOGLE,
        resourceType: 'profile',
        resource: {
          email: 'someemail@gmail.com',
          userName: 'abcd',
          auth_type_google: {id: '1234', email: 'someemail11@gmail.com'},
        },
      };
      const initialProfileState = reducer(undefined, action);
      const state = reducer(initialProfileState, actions.user.profile.unlinkedWithGoogle());

      expect(state).toEqual({ auth_type_google: {} });
    });
  });

  describe('avatarUrl', () => {
    test('should return undefined if no profile exists', () => {
      expect(selectors.avatarUrl(undefined)).toBeUndefined();
      expect(selectors.avatarUrl({})).toBeUndefined();
    });

    test('should return correct url if profile exists', () => {
      const mockProfile = { emailHash: '123' };
      const state = reducer(
        undefined,
        actions.resource.received('profile', mockProfile)
      );

      expect(selectors.avatarUrl(state)).toEqual(
        `https://secure.gravatar.com/avatar/123?d=${process.env.CDN_BASE_URI}images/icons/icon-user-default.png&s=55`
      );
    });
  });
  describe('Upgrade error management', () => {
    test('should return correct error management if it exists', () => {
      const mockProfile = { useErrMgtTwoDotZero: true };
      const state = reducer(
        undefined,
        actions.resource.received('profile', mockProfile)
      );

      expect(selectors.isUserInErrMgtTwoDotZero(state)).toEqual(
        true
      );
    });
    test('should return undefined if no error management exists', () => {
      expect(selectors.isUserInErrMgtTwoDotZero(undefined)).toEqual(false);
      expect(selectors.isUserInErrMgtTwoDotZero({})).toEqual(false);
    });
  });
});
