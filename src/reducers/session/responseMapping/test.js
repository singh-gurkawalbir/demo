/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('Response mapping', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should set status to requested on init', () => {
    const flowId = '123';
    const resourceId = '123';
    const state = reducer(undefined, actions.responseMapping.init({
      flowId,
      resourceId,
    }));

    expect({mapping: {status: 'requested'}}).toEqual(state);
  });

  test('should set status to recieved on init complete', () => {
    const state = reducer(undefined, actions.responseMapping.initComplete({}));

    expect(state.mapping.status).toEqual('received');
  });
  test('should set status to error on init failure', () => {
    const state2 = reducer({}, actions.responseMapping.initFailed({}));
    const expectedState = {
      mapping: {
        status: 'error',
      },
    };

    expect(state2).toEqual(expectedState);
  });
  test('should delete row item correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.responseMapping.delete('key2'));

    expect(newState).toEqual(expectedState);
  });
  test('should create new row with generate', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},

        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: expect.anything(), generate: 'xyz3'},
        ],
      },
    };
    const newState = reducer(initialState, actions.responseMapping.patchField('generate', 'new', 'xyz3'));

    expect(newState).toEqual(expectedState);
  });

  test('should patch generate value correctly against key correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'newValue', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.responseMapping.patchField('generate', 'key2', 'newValue'));

    expect(newState).toEqual(expectedState);
  });

  test('should patch extract value correctly against key correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'newValue'},
        ],
      },
    };
    const newState = reducer(initialState, actions.responseMapping.patchField('extract', 'key2', 'newValue'));

    expect(expectedState).toEqual(newState);
  });

  test('should create new row with extract', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},

        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: expect.anything(), extract: 'xyz3'},
        ],
      },
    };
    const newState = reducer(initialState, actions.responseMapping.patchField('extract', 'new', 'xyz3'));

    expect(newState).toEqual(expectedState);
  });
  test('should set saveStatus to requested on save request', () => {
    const initialState = {
      mapping: {
        mappings: [{generate: 'a', extract: 'b'}],
        mappingsCopy: [{generate: 'a', extract: 'a'}],
      },
    };
    const state = reducer(initialState, actions.responseMapping.save({}));
    const expectedState = {
      mapping: {
        mappings: [{generate: 'a', extract: 'b'}],
        mappingsCopy: [{generate: 'a', extract: 'a'}],
        saveStatus: 'requested',
      },
    };

    expect(state).toEqual(expectedState);
  });
  test('should set saveStatus to completed and resync copy of mapping on save success', () => {
    const initialState = {
      mapping: {
        mappings: [{generate: 'a', extract: 'b'}],
        mappingsCopy: [{generate: 'a', extract: 'a'}],
      },
    };
    const state = reducer(initialState, actions.responseMapping.saveComplete());
    const expectedState = {
      mapping: {
        mappings: [{generate: 'a', extract: 'b'}],
        mappingsCopy: [{generate: 'a', extract: 'b'}],
        saveStatus: 'completed',
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('selector[responseMappingSaveStatus] should return status correctly when state is not initialized', () => {
    const value = selectors.responseMappingSaveStatus(undefined);

    expect({}).toEqual(value);
  });

  test('selector[responseMappingSaveStatus] should return status correctly while saving', () => {
    const state = reducer({mapping: {}}, actions.responseMapping.save({}));
    const result = selectors.responseMappingSaveStatus(state);

    expect({
      saveCompleted: false,
      saveInProgress: true,
      saveTerminated: false,
    }).toEqual(result);
  });

  test('selector[responseMappingSaveStatus] should return status correctly when save fails', () => {
    const state = reducer({mapping: {}}, actions.responseMapping.save({}));
    const newState = reducer(state, actions.responseMapping.saveFailed({}));
    const result = selectors.responseMappingSaveStatus(newState);

    expect({
      saveCompleted: false,
      saveInProgress: false,
      saveTerminated: true,
    }).toEqual(result);
  });

  test('selector[responseMappingSaveStatus] should return status correctly when save is completed', () => {
    const state = reducer({mapping: {}}, actions.responseMapping.save({}));
    const newState = reducer(state, actions.responseMapping.saveComplete());
    const result = selectors.responseMappingSaveStatus(newState);

    expect({
      saveCompleted: true,
      saveInProgress: false,
      saveTerminated: true,
    }).toEqual(result);
  });

  test('selector[responseMapping] should return correct state before init', () => {
    const value = selectors.responseMapping(undefined);

    expect({}).toEqual(value);
  });
  test('selector[responseMapping] should return correct state after init complete', () => {
    const flowId = '123';
    const resourceId = '123';
    const state = reducer(undefined, actions.responseMapping.init({
      flowId,
      resourceId,
    }));
    let newState = reducer(state, actions.responseMapping.initComplete({
      mappings: [{generate: 'a', extract: 'b', key: 'k1'}],
      flowId,
      resourceId,
      resourceType: 'imports',
    }));

    const {mappings} = selectors.responseMapping(newState);

    expect([{generate: 'a', extract: 'b', key: 'k1'}]).toEqual(mappings);

    newState = reducer(newState, actions.responseMapping.patchField('generate', 'new', 'xyz3'));
    const {mappings: mappingsAfterPatch} = selectors.responseMapping(newState);

    expect([{generate: 'a', extract: 'b', key: 'k1'}, {generate: 'xyz3', key: expect.anything()}]).toEqual(mappingsAfterPatch);
  });

  test('selector[responseMappingChanged] should return false in case response mapping is not yet initialized', () => {
    const isMappingChanged = selectors.responseMappingChanged(undefined);

    expect(false).toEqual(isMappingChanged);
  });

  test('selector[responseMappingChanged] should return true in case mapping is changed', () => {
    const state = {
      mapping: {
        mappings: [
          {generate: 'a', extract: 'b', key: 'k1'},
          {generate: 'c', extract: 'd', key: 'k2'},
        ],
        mappingsCopy: [
          {generate: 'a', extract: 'b', key: 'k1'},
          {generate: 'c', extract: 'd', key: 'k2'},
        ],
      },
    };
    const newState = reducer(state, actions.responseMapping.patchField('generate', 'new', 'xyz3'));

    const isMappingChanged = selectors.responseMappingChanged(newState);

    expect(true).toEqual(isMappingChanged);
  });

  test('selector[responseMappingChanged] should return true in case mapping order is changed', () => {
    const state = {
      mapping: {
        mappings: [
          {generate: 'a', extract: 'b', key: 'k1'},
          {generate: 'c', extract: 'd', key: 'k2'},
        ],
        mappingsCopy: [
          {generate: 'c', extract: 'd', key: 'k2'},
          {generate: 'a', extract: 'b', key: 'k3'},

        ],
      },
    };
    const newState = reducer(state, actions.responseMapping.patchField('generate', 'new', 'xyz3'));

    const isMappingChanged = selectors.responseMappingChanged(newState);

    expect(true).toEqual(isMappingChanged);
  });

  test('selector[responseMappingChanged] should return false in case mapping order [generate and extract] is same', () => {
    const state = {
      mapping: {
        mappings: [
          {generate: 'a', extract: 'b', key: 'k1'},
          {generate: 'c', extract: 'd', key: 'k2'},
        ],
        mappingsCopy: [
          {generate: 'a', extract: 'b', key: 'k4'},
          {generate: 'c', extract: 'd', key: 'k5'},

        ],
      },
    };
    const newState = reducer(state, actions.responseMapping.patchField('generate', 'new', 'xyz3'));

    const isMappingChanged = selectors.responseMappingChanged(newState);

    expect(true).toEqual(isMappingChanged);
  });
});
