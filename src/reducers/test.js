/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import reducer, * as selectors from './';
import actions from '../actions';

describe('global selectors', () => {
  describe(`isProfileDataReady`, () => {
    test('should return false on bad or empty state.', () => {
      expect(selectors.isProfileDataReady()).toBe(false);
      expect(selectors.isProfileDataReady({})).toBe(false);
      expect(selectors.isProfileDataReady({ session: {} })).toBe(false);
    });

    test('should return true when profile exists.', () => {
      const state = reducer(
        undefined,
        actions.profile.received('mock profile')
      );

      expect(selectors.isProfileDataReady(state)).toBe(true);
    });
  });

  describe('resourceData', () => {
    test('should return {} on bad state or args.', () => {
      expect(selectors.resourceData()).toEqual({});
      expect(selectors.resourceData({})).toEqual({});
      expect(selectors.resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: { _id: 1, name: 'patch X' },
        patch,
        master: exports[0],
      });
    });
  });
});

describe('Reducers in the root reducer', () => {
  test('should wipe out the redux store in a user logout action', () => {
    const someInitialState = {
      profile: { email: 'sds' },
    };
    const state = reducer(someInitialState, actions.auth.clearStore());

    expect(state).toEqual({});
  });
});

describe('Comm selector to verify comms exceeding threshold', () => {
  const path = '/somePath';

  test('selector taking long should not show the component only if any comms msg is transiting less than the network threshold', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    const state = reducer(undefined, actions.api.request(path));

    advanceBy(5);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
  test('verify comm selector for multiple resources', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    let state = reducer(undefined, actions.api.request(path));

    state = reducer(state, actions.api.request('someotherResource'));

    advanceBy(50);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);
    state = reducer(state, actions.api.complete(path));
    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
});
