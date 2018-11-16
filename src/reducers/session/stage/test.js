/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('stage reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { id: { conflict: [], patch: [] } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe(`STAGE_CLEAR action`, () => {
    test('should do nothing if there is nothing staged', () => {
      const id = 123;
      const state = reducer(undefined, actions.resource.clearStaged(id));

      expect(state[id]).toBeUndefined();
    });

    test('should clear staged patches if id matches', () => {
      const id = 123;
      const patch = { op: 'replace', path: '/name', value: 'ABC' };
      let state;

      state = reducer(state, actions.resource.patchStaged(id, [patch]));
      state = reducer(
        state,
        actions.resource.patchStaged(id, [{ ...patch, path: '/other' }])
      );
      expect(state[id].patch.length).toEqual(2);

      state = reducer(state, actions.resource.clearStaged(id));
      expect(state[id].patch).toBeUndefined();
    });
  });

  describe(`STAGE_UNDO action`, () => {
    test('should do nothing if there is nothing staged.', () => {
      const id = 123;
      const state = reducer(undefined, actions.resource.undoStaged(id));

      expect(state[id]).toBeUndefined();
    });

    test('should undo last staged patch if id matches.', () => {
      const id = 123;
      const patch = { op: 'replace', path: '/name', value: 'ABC' };
      let state;

      state = reducer(state, actions.resource.patchStaged(id, [patch]));
      state = reducer(
        state,
        actions.resource.patchStaged(id, [{ ...patch, path: '/other' }])
      );
      expect(state[id].patch.length).toEqual(2);

      state = reducer(state, actions.resource.undoStaged(id));
      expect(state[id].patch).toEqual([patch]);
    });
  });

  describe(`STAGE_PATCH action`, () => {
    test('should add patch if none yet exist.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const state = reducer(undefined, actions.resource.patchStaged(id, patch));

      expect(state[id]).toEqual({
        patch,
        lastChange: expect.any(Number), // date is epoc date
      });
    });

    test('should add subsequent patch if id matches and patch exists', () => {
      const id = 123;
      const patch1 = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const patch2 = [{ op: 'replace', path: '/desc', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch1));
      state = reducer(state, actions.resource.patchStaged(id, patch2));

      expect(state[id]).toEqual({
        patch: [...patch1, ...patch2],
        lastChange: expect.any(Number), // date is epoc date
      });
    });

    test('should replace subsequent patch if id matches and patch path matches', () => {
      const id = 123;
      const patch1 = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const patch2 = [{ op: 'replace', path: '/name', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch1));
      state = reducer(state, actions.resource.patchStaged(id, patch2));

      expect(state[id]).toEqual({
        patch: [{ op: 'replace', path: '/name', value: '123' }],
        lastChange: expect.any(Number), // date is epoc date
      });
    });
  });

  describe(`STAGE_CONFLICT action`, () => {
    test('should add conflict to stage if none yet exist.', () => {
      const id = 123;
      const conflict = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const state = reducer(
        undefined,
        actions.resource.commitConflict(id, conflict)
      );

      expect(state[id]).toEqual({ conflict });
    });

    test('should add subsequent patch if id matches and patch exists', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const conflict = [{ op: 'replace', path: '/desc', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));
      state = reducer(state, actions.resource.commitConflict(id, conflict));

      expect(state[id]).toEqual({
        patch,
        conflict,
        lastChange: expect.any(Number), // date is epoc date
      });
    });
  });

  describe(`CLEAR_CONFLICT action`, () => {
    test('should do nothing if no conflict yet exists.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const stateA = reducer(
        undefined,
        actions.resource.patchStaged(id, patch)
      );
      const stateB = reducer(stateA, actions.resource.clearConflict(id));

      expect(stateA).toEqual(stateB);
    });

    test('should should clear conflict if one exists', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const conflict = [{ op: 'replace', path: '/desc', value: '123' }];
      const stateA = reducer(
        undefined,
        actions.resource.patchStaged(id, patch)
      );
      let stateB;

      stateB = reducer(stateA, actions.resource.commitConflict(id, conflict));
      stateB = reducer(stateB, actions.resource.clearConflict(id));

      expect(stateA).toEqual(stateB);
    });
  });
});

describe('stage selectors', () => {
  describe(`stagedResource`, () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.stagedResource(undefined, 'key')).toEqual({});
      expect(selectors.stagedResource({}, 'key')).toEqual({});
    });

    test('should return staged respource when match found.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const conflict = [{ op: 'replace', path: '/desc', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));
      state = reducer(state, actions.resource.commitConflict(id, conflict));

      expect(selectors.stagedResource(state, id)).toEqual({
        patch,
        conflict,
        lastChange: expect.any(Number), // date is epoc date
      });
    });
  });
});
