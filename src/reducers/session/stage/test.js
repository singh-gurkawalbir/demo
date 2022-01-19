/* global describe, test, expect */
import reducer, { selectors } from '.';
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
});

describe('stage selectors', () => {
  describe('stagedResource', () => {
    test('should return null when no match found.', () => {
      expect(selectors.stagedResource(undefined, 'key')).toEqual(null);
      expect(selectors.stagedResource({}, 'key')).toEqual(null);
    });
    test('should return empty object when invalid resourceId is sent.', () => {
      expect(selectors.stagedResource({}, '')).toEqual(null);
      expect(selectors.stagedResource({}, null)).toEqual(null);
      expect(selectors.stagedResource({}, undefined)).toEqual(null);
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
    test('should return cached result of the staged resource when match found.', () => {
      const id = 123;
      const patch = [{ op: 'replace', path: '/name', value: 'ABC' }];
      const conflict = [{ op: 'replace', path: '/desc', value: '123' }];
      let state;

      state = reducer(state, actions.resource.patchStaged(id, patch));

      state = reducer(state, actions.resource.commitConflict(id, conflict));
      const res = selectors.stagedResource(state, id);

      expect(res).toEqual({
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        conflict,
      });
      // check calling again with the same arguments would return the cached result
      expect(selectors.stagedResource(state, id)).toBe(res);
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
  });
});
