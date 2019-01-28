/* global describe, test, expect */
import reducer, * as selectors from './';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';

describe('user reducers', () => {
  describe('profile reducers', () => {
    const someTestProfile1 = { name: 'profile 1' };
    const someTestProfile2 = { name: 'profile 2' };

    test('when profile resource request is received should get resource message', () => {
      const state = reducer(
        undefined,
        actions.profile.received(someTestProfile1)
      );

      expect(state).toEqual(someTestProfile1);
    });

    test('should replace existing profile with a new one.', () => {
      let state;

      state = reducer(state, actions.profile.received(someTestProfile1));
      expect(state).toEqual(someTestProfile1);

      state = reducer(state, actions.profile.received(someTestProfile2));
      expect(state).toEqual(someTestProfile2);
    });

    test('when delete profile action is dispatched wipe out user profile info except for the user email ', () => {
      const action = {
        type: actionTypes.RESOURCE.RECEIVED,
        resourceType: 'profile',
        resource: {
          email: 'someemail@gmail.com',
          userName: 'abcd',
        },
      };
      const initialProfileState = reducer(undefined, action);
      const state = reducer(initialProfileState, actions.profile.delete());

      expect(state).toEqual({ email: action.resource.email });
    });
  });

  describe(`avatarUrl`, () => {
    test('should return undefined if no profile exists', () => {
      expect(selectors.avatarUrl(undefined)).toBeUndefined();
      expect(selectors.avatarUrl({})).toBeUndefined();
    });

    test('should return correct url if profile exists', () => {
      const mockProfile = { emailHash: '123' };
      const state = reducer(undefined, actions.profile.received(mockProfile));

      expect(selectors.avatarUrl(state)).toEqual(
        'https://secure.gravatar.com/avatar/123?d=mm&s=55'
      );
    });
  });
});
