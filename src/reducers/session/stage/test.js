/* global describe, test, expect */
import reducer, * as selectors from '.';
import actions from '../../../actions';

describe('stage reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { id: { conflict: [], patch: [] } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('STAGE_CLEAR action', () => {
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

  describe('STAGE_UNDO action', () => {
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
      expect(state[id].patch).toEqual([
        { ...patch, timestamp: expect.any(Number) },
      ]);
    });
  });

  describe('STAGE_PATCH action', () => {
    test('should add patch if none yet exist.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const state = reducer(undefined, actions.resource.patchStaged(id, patch));

      expect(state[id]).toEqual({
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
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
        patch: [
          { ...patch1[0], timestamp: expect.any(Number) },
          { ...patch2[0], timestamp: expect.any(Number) },
        ],
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
        patch: [
          {
            op: 'replace',
            path: '/name',
            value: '123',
            timestamp: expect.any(Number),
          },
        ],
      });
    });
  });

  describe('STAGE_CONFLICT action', () => {
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
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        conflict,
      });
    });
  });

  describe('CLEAR_CONFLICT action', () => {
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
  describe('stagedResource', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.stagedResource(undefined, 'key')).toEqual({});
      expect(selectors.stagedResource({}, 'key')).toEqual({});
    });

    test('should return staged resource when match found.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const conflict = [{ op: 'replace', path: '/desc', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));

      state = reducer(state, actions.resource.commitConflict(id, conflict));

      expect(selectors.stagedResource(state, id)).toEqual({
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        conflict,
      });
    });
  });

  describe('getAllResourceConflicts', () => {
    const id = '123';
    const conflictResId = '124';
    const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
    const conflict = [{ op: 'replace', path: '/desc', value: '123' }];

    test('should return empty array when no staged changes are there.', () => {
      expect(selectors.getAllResourceConflicts(undefined)).toEqual([]);
    });

    test('should return only conflicted resources', () => {
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));

      // commiting conflicting patch
      state = reducer(
        state,
        actions.resource.commitConflict(conflictResId, conflict)
      );

      expect(selectors.getAllResourceConflicts(state)).toEqual([
        { resourceId: conflictResId, conflict },
      ]);
    });

    test('should return an empty array once the resource conflict is resolved', () => {
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));

      // commiting conflicting patch
      state = reducer(
        state,
        actions.resource.commitConflict(conflictResId, conflict)
      );

      expect(selectors.getAllResourceConflicts(state)).toEqual([
        { resourceId: conflictResId, conflict },
      ]);
      state = reducer(state, actions.resource.clearConflict(conflictResId));
      // after clearing conflict expect nothing to show up
      expect(selectors.getAllResourceConflicts(state)).toEqual([]);
    });
  });
});
