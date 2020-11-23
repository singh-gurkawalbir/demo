/* global describe, test, expect */

import reducer from '.';
// import actions from '../../../actions';

describe('Response mapping', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
});
