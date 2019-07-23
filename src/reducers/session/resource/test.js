/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('session.resource reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { 'new-1234': 'ab123' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe(`RESOURCE.CREATED action`, () => {
    test('should store the created resource ID mapped to tempId', () => {
      const tempId = 'new-123';
      const dbId = 'abc123';
      const state = reducer(undefined, actions.resource.created(dbId, tempId));

      expect(state[tempId]).toEqual(dbId);
    });
  });
});

describe('session.resource selectors', () => {
  describe(`createdResourceId`, () => {
    test('should return undefined when no match found.', () => {
      expect(selectors.createdResourceId(undefined, 'tempId')).toEqual(
        undefined
      );
      expect(selectors.createdResourceId({}, 'tempId')).toEqual(undefined);
    });

    test('should return correct newly created ID when match against tempId found.', () => {
      const tempId = 'new-123';
      const dbId = 'abc123';
      const state = reducer(undefined, actions.resource.created(dbId, tempId));

      expect(selectors.createdResourceId(state, tempId)).toEqual(dbId);
    });
  });
});
