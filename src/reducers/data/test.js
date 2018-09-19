/* global describe, test, expect */
import reducer from './';
// import reducer, * as selectors from './';
import actions, { availableResources } from '../../actions';

describe('data reducers', () => {
  availableResources.forEach(resource => {
    describe(`${resource} received action`, () => {
      test('should store the new data', () => {
        const data = 'test data';
        const state = reducer(undefined, actions[resource].received(data));

        expect(state[resource]).toEqual(data);
      });

      test('should replace existing data with the new data', () => {
        const data1 = 'test data';
        const data2 = 'new test data';
        let state;

        state = reducer(state, actions[resource].received(data1));
        expect(state[resource]).toEqual(data1);

        state = reducer(state, actions[resource].received(data2));
        expect(state[resource]).toEqual(data2);
      });
    });
  });
});
