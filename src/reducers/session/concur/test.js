/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('concur reducers', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should initialize state correct on connect', () => {
    const state = reducer(undefined, actions.concur.connect());

    expect(state).toEqual({isLoading: true});
  });
  test('should delete isLoading when data is successfully fetched', () => {
    const state = reducer(undefined, actions.concur.connect());
    const newState = reducer(state, actions.concur.connectSuccess({}));

    expect(newState).toEqual({data: {}});
  });
  test('should delete isLoading when data is fetch errored', () => {
    const state = reducer(undefined, actions.concur.connect());
    const newState = reducer(state, actions.concur.connectError({}));

    expect(newState).toEqual({error: {}});
  });

  test('should populate the data correctly for success', () => {
    const state = reducer(undefined, actions.concur.connect());
    const newState = reducer(state, actions.concur.connectSuccess({xyz: 'abc'}));

    expect(newState).toEqual({data: {xyz: 'abc'}});
  });
  test('should populate the data correctly for fetch error', () => {
    const state = reducer(undefined, actions.concur.connect());
    const newState = reducer(state, actions.concur.connectError({message: '123'}));

    expect(newState).toEqual({error: {message: '123'}});
  });
});

describe('concur selector', () => {
  test('selector concurData should return undefined in case state is not initialized', () => {
    const data = selectors.concurData(undefined);

    expect().toEqual(data);
  });
  test('selector[concurData] should return state correctly', () => {
    const state = {
      data: {
        tabs: [
          {a: 1},
        ],
        otherProp: 'a',
      },
    };
    const data = selectors.concurData(state);

    expect(data).toEqual({
      tabs: [
        {a: 1},
      ],
      otherProp: 'a',
    });
  });
  test('selector[concurData] should return state correctly', () => {
    const state = {
      error: {
        tabs: [
          {a: 1},
        ],
        otherProp: 'a',
      },
    };
    const data = selectors.concurErrorMessage(state);

    expect(data).toEqual({
      tabs: [
        {a: 1},
      ],
      otherProp: 'a',
    });
  });
  test('selector[isConcurDataLoading] should return state correctly', () => {
    const state = {
      isLoading: true,
    };
    const data = selectors.isConcurDataLoading(state);

    expect(data).toEqual(true);
    expect(selectors.isConcurDataLoading({})).toEqual(false);
  });
});
