/* global describe, test, expect */

import reducer from '.';
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
});
