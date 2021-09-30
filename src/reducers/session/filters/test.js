/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('filter reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('PATCH_FILTER action', () => {
    test('should set the filter on first action', () => {
      const name = 'testFilter';
      const filter = { keyword: 'findme', take: 5 };
      const state = reducer(undefined, actions.patchFilter(name, filter));

      expect(state[name]).toEqual({
        keyword: 'findme',
        take: 5,
      });
    });

    test('should override existing filter options on subsequent PATCH_FILTER actions', () => {
      const name = 'testFilter';
      let state;
      const filter = { keyword: 'findme', take: 5 };

      state = reducer(undefined, actions.patchFilter(name, filter));
      state = reducer(
        state,
        actions.patchFilter(name, { take: 6, newCriteria: true })
      );

      expect(state[name]).toEqual({
        keyword: 'findme',
        take: 6,
        newCriteria: true,
      });
    });
  });

  describe('CLEAR_FILTER action', () => {
    test('should do nothing if filter doesnt exist', () => {
      const filter = { keyword: 'findme', take: 5 };
      let state;

      state = reducer(undefined, actions.patchFilter('someFilter', filter));
      state = reducer(state, actions.clearFilter('otherFilter'));

      expect(state.someFilter).toEqual(filter);
      expect(state.otherFilter).toBeUndefined();
    });

    test('should clear filter if it exist', () => {
      const filter = { keyword: 'findme', take: 5 };
      let state;

      state = reducer(undefined, actions.patchFilter('someFilter', filter));
      expect(state.someFilter).toEqual(filter);

      state = reducer(state, actions.clearFilter('someFilter'));
      expect(state.someFilter).toBeUndefined();
    });

    test('should return just status for a jobs filter', () => {
      const filter = { keyword: 'findme', take: 5, status: 'someStatus' };
      let state;

      state = reducer(undefined, actions.patchFilter('jobs', filter));
      expect(state.jobs).toEqual(filter);

      state = reducer(state, actions.clearFilter('jobs'));
      expect(state.jobs).toEqual({status: 'someStatus'});
    });
  });
});

describe('filter selectors', () => {
  describe('filter', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.filter(undefined, 'key')).toEqual({});
      expect(selectors.filter({}, 'key')).toEqual({});
    });

    test('should return filter when match found.', () => {
      const testFilter = { key: 'abc', take: 5 };
      const state = reducer(
        undefined,
        actions.patchFilter('testFilter', testFilter)
      );

      expect(selectors.filter(state, 'testFilter')).toEqual(testFilter);
    });
  });
});
