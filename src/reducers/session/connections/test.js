/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('Connections API', () => {
  describe('activeConnection', () => {
    describe('reducer', () => {
      test('should properly store active connection when given an id', () => {
        const id = 'conn123';
        const state = reducer(undefined, actions.connection.setActive(id));

        expect(state.activeConnection).toEqual(id);
      });

      test('should properly clear active connection when given no value', () => {
        const state = reducer(undefined, actions.connection.setActive());

        expect(state.activeConnection).toEqual(undefined);
      });
    });

    describe('selector', () => {
      test('should return undefined when no active connection is present', () => {
        expect(selectors.activeConnection()).toBeUndefined();
        expect(selectors.activeConnection({})).toBeUndefined();
        expect(selectors.activeConnection({activeConnection: undefined})).toBeUndefined();
      });

      test('should return active connection when present', () => {
        const id = 'new-123';
        const state = reducer(undefined, actions.connection.setActive(id));

        expect(selectors.activeConnection(state)).toEqual(id);
      });
    });
  });
});

