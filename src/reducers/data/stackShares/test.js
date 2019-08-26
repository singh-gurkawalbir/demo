/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('stackShare reducer', () => {
  describe('received stack share collection action', () => {
    test('should store the new collection', () => {
      const collection = 'test collection';
      const state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      expect(state).toEqual(collection);
    });
    test('should replace existing collection with the new colletion', () => {
      const collection1 = 'test collection';
      const collection2 = 'new test collection';
      let state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection: collection1 })
      );

      expect(state).toEqual(collection1);

      state = reducer(
        state,
        actions.stack.receivedStackShareCollection({ collection: collection2 })
      );
      expect(state).toEqual(collection2);
    });
  });
  describe('delete stack share user action', () => {
    const collection = [
      { _id: 'id1', name: 'rob' },
      { _id: 'id2', name: 'bob' },
    ];

    test('should delete an existing stack share user', () => {
      let state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      state = reducer(
        state,
        actions.stack.deletedStackShareUser({ userId: 'id2' })
      );
      expect(state).toEqual([collection[0]]);
    });
    test('should not delete any stack share user if there is no user with given id', () => {
      let state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      state = reducer(
        state,
        actions.stack.deletedStackShareUser({ userId: 'id3' })
      );
      expect(state).toEqual(collection);
    });
  });
  describe('user stack sharing toggle action', () => {
    const collection = [
      { _id: 'id1', name: 'rob', disabled: false },
      { _id: 'id2', name: 'bob', disabled: true },
    ];

    test('should toggle the disabled flag for valid user id is provided', () => {
      let state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      state = reducer(
        state,
        actions.stack.toggledUserStackSharing({ userId: 'id2' })
      );
      expect(state[0].disabled).toEqual(false);
      expect(state[1].disabled).toEqual(false);
    });
    test('should not toggle the disabled flag if invalid user id is provided', () => {
      let state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      state = reducer(
        state,
        actions.stack.toggledUserStackSharing({ userId: 'id3' })
      );
      expect(state).toEqual(collection);
      expect(state[0].disabled).toEqual(false);
      expect(state[1].disabled).toEqual(true);
    });
  });
});
describe('stack share selectors', () => {
  describe('getStackShareCollection', () => {
    test('should return null on undefined state.', () => {
      expect(selectors.getStackShareCollection(undefined)).toBeNull();
    });
    test('should return empty object on empty state.', () => {
      expect(selectors.getStackShareCollection({})).toEqual({});
    });
    test('should return stack share collection for valid state', () => {
      const collection = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
      const state = reducer(
        undefined,
        actions.stack.receivedStackShareCollection({ collection })
      );

      expect(selectors.getStackShareCollection(state)).toEqual(collection);
    });
  });
});
