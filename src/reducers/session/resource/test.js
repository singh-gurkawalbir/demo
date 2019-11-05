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
  describe('RESOURCE.REFERENCES_RECEIVED action', () => {
    test(`should store the references in the state`, () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );

      expect(state.references).toEqual(testReferences);
    });
  });
  describe('RESOURCE.REFERENCES_CLEAR action', () => {
    test(`should delete the references from the state`, () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );
      const newState = reducer(state, actions.resource.clearReferences());

      expect(newState).toEqual({});
    });
    test(`should not delete new id from other parts of the store`, () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const tempId = 'new123';
      const dbId = 'abc123';
      let state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );

      state = reducer(state, actions.resource.created(dbId, tempId));

      expect(state.new123).toEqual(dbId);

      state = reducer(state, actions.resource.clearReferences());
      expect(state.new123).toEqual(dbId);
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
        const state = reducer(
          undefined,
          actions.resource.created(dbId, tempId)
        );

        expect(selectors.createdResourceId(state, tempId)).toEqual(dbId);
      });
    });
    describe('resourceReferences', () => {
      test('should return empty object when state is undefined', () => {
        expect(selectors.resourceReferences(undefined)).toEqual(null);
      });
      test(`should return references for valid state`, () => {
        const testReferences = {
          imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
          exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
        };
        const state = reducer(
          undefined,
          actions.resource.receivedReferences(testReferences)
        );
        const { references } = state;
        const referencesArray = [];

        Object.keys(references).forEach(type =>
          references[type].forEach(refObj => {
            referencesArray.push({
              resourceType: type,
              id: refObj.id,
              name: refObj.name,
            });
          })
        );

        expect(selectors.resourceReferences(state)).toEqual(referencesArray);
      });
    });
  });
});
