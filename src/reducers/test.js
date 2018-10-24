/* global describe, test, expect */
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
    test('should return null on bad state or args.', () => {
      expect(selectors.resourceData()).toBeNull();
      expect(selectors.resourceData({})).toBeNull();
      expect(selectors.resourceData({ data: {} })).toBeNull();
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test E' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: exports[0],
        staged: undefined,
        resource: exports[0],
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test E' }];
      const patch = { name: 'text X' };
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: { ...exports[0], ...patch },
        staged: patch,
        resource: exports[0],
      });
    });
  });
});
