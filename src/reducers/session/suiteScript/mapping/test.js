/* global describe, test, expect */

import { deepClone } from 'fast-json-patch';
import reducer, {selectors} from '.';
import actions from '../../../../actions';

describe('Suitescript mapping reducers', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should set mapping status to requested on mapping init', () => {
    const state = reducer(undefined, actions.suiteScript.mapping.init({
      ssLinkedConnectionId: 'a', integrationId: 'b', flowId: 'c',
    }));

    expect({mapping: {status: 'requested'}}).toEqual(state);
  });

  test('should set mapping status to received on mapping init complete', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.initComplete({
      something: {},
      mappings: [],
    }));

    expect(state.mapping.status).toEqual('received');
  });

  test('should create a duplicate of mapping and lookup on mapping init complete', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.initComplete({
      mappings: [{something: 'something'}],
      lookups: [{xyz: 'xyz'}],
    }));

    expect({
      mappings: state.mapping.mappings,
      lookups: state.mapping.lookups,
      mappingsCopy: deepClone(state.mapping.mappings),
      lookupsCopy: deepClone(state.mapping.lookups),
    }).toEqual({
      mappings: [{something: 'something', key: expect.anything()}],
      lookups: [{xyz: 'xyz'}],
      mappingsCopy: [{something: 'something', key: expect.anything()}],
      lookupsCopy: [{xyz: 'xyz'}],
    });
  });

  test('should set mapping status to error on mapping init failed', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.initFailed());

    expect(state.mapping.status).toEqual('error');
  });

  test('should delete mapping correctly', () => {
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
    const newState = reducer(initialState, actions.suiteScript.mapping.delete('key2'));

    expect(newState).toEqual(expectedState);
  });

  test('should not delete mapping if key does not match any record', () => {
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
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.delete('something'));

    expect(newState).toEqual(expectedState);
  });

  test('should delete associated lookup if any when deleting mapping', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {x: 'y'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.delete('key2'));

    expect(newState).toEqual(expectedState);
  });

  test('should remove lastModifiedRowKey if last touched row is deleted', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.delete('key1'));

    expect(newState).toEqual(expectedState);
  });

  test('should patch generate correctly when existing mapping row is changed', () => {
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
          {key: 'key1', generate: 'changed', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('generate', 'key1', 'changed'));

    expect(newState).toEqual(expectedState);
  });

  test('should patch extract correctly when existing mapping row is changed', () => {
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
          {key: 'key1', generate: 'xyz1', extract: 'changed'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'key1', 'changed'));

    expect(newState).toEqual(expectedState);
  });

  test('should add new row with generate correctly if key doesnt match', () => {
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
          {key: expect.anything(), generate: 'xyz'},
        ],
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('generate', 'newKey', 'xyz'));

    expect(newState).toEqual(expectedState);
  });

  test('should add new row with extract correctly if key doesnt match', () => {
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
          {key: expect.anything(), extract: 'xyz'},
        ],
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'newKey', 'xyz'));

    expect(newState).toEqual(expectedState);
  });

  test('should add new row with hardCodedValue correctly if key doesnt match', () => {
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
          {key: expect.anything(), hardCodedValue: 'xyz'},
        ],
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'newKey', '"xyz"'));

    expect(newState).toEqual(expectedState);
  });

  test('should add new row with hardCodedValue[value starting with " but not ending with "] correctly if key doesnt match', () => {
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
          {key: expect.anything(), hardCodedValue: 'xyz'},
        ],
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'newKey', '"xyz'));

    expect(newState).toEqual(expectedState);
  });

  test('should remove extract and add hardCodedValue correctly', () => {
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
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'something else'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'key2', '"something else"'));

    expect(newState).toEqual(expectedState);
  });
  test('should remove extract and add hardCodedValue[value starting with " but not ending with "] correctly', () => {
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
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'something'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'key2', '"something'));

    expect(newState).toEqual(expectedState);
  });
  test('should patch settings correctly', () => {
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz', lookupName: 'lookupName', others: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { lookupName: 'lookupName', others: 'xyz'};
    const newState = reducer(initialState, actions.suiteScript.mapping.patchSettings('key1', settings));

    expect(newState).toEqual(expectedState);
  });

  test('should remove lookup while saving settings correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'l1'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz', something: 'else', others: 'xyz'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const settings = { something: 'else', others: 'xyz'};
    const newState = reducer(initialState, actions.suiteScript.mapping.patchSettings('key2', settings));

    expect(newState).toEqual(expectedState);
  });

  test('should not alter state if key doesnt match while saving settings', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { hardCodedValue: 'xyz', others: 'abc'};
    const newState = reducer(initialState, actions.suiteScript.mapping.patchSettings('something', settings));

    expect(newState).toEqual(expectedState);
  });
  test('should retain hardCodedValue while saving settings', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz', others: 'abc' },
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const settings = { hardCodedValue: 'xyz', others: 'abc'};
    const newState = reducer(initialState, actions.suiteScript.mapping.patchSettings('key2', settings));

    expect(newState).toEqual(expectedState);
  });
  test('should remove hardCodedValue while saving settings correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'ext', others: 'xyz'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const settings = { extract: 'ext', others: 'xyz'};
    const newState = reducer(initialState, actions.suiteScript.mapping.patchSettings('key2', settings));

    expect(newState).toEqual(expectedState);
  });

  test('should shift mapping correctly while changing order', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
          {key: 'key3', generate: 'xyz3' },
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key3', generate: 'xyz3' },
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},

        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.shiftOrder('key3', 0));

    expect(newState).toEqual(expectedState);
  });

  test('should not change mappings in case mapping is dragged to its original position', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
          {key: 'key3', generate: 'xyz3' },
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
          {key: 'key3', generate: 'xyz3' },
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.shiftOrder('key2', 1));

    expect(newState).toEqual(expectedState);
  });

  test('should add lookup correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [{name: 'l1', abc: 'xyz'}],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [
          {name: 'l1', abc: 'xyz'},
          {name: 'xyz', others: 'abc'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.updateLookup({
      oldValue: undefined,
      newValue: {name: 'xyz', others: 'abc'},
    }));

    expect(newState).toEqual(expectedState);
  });

  test('should delete lookup correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [
          {name: 'xyz', others: 'abc'},
          {name: 'l1', abc: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [
          {name: 'xyz', others: 'abc'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.updateLookup({
      oldValue: {name: 'l1'},
      newValue: undefined,
    }));

    expect(newState).toEqual(expectedState);
  });

  test('should update existing lookup correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [
          {name: 'l1', abc: 'xyz'},
          {name: 'xyz', others: 'abc'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        lookups: [
          {name: 'xyz', others: 'abc'},
          {name: 'newName', something: 'else'},
        ],
      },
    };

    const newState = reducer(initialState, actions.suiteScript.mapping.updateLookup({
      oldValue: {name: 'l1'},
      newValue: {name: 'newName', something: 'else'},
    }));

    expect(newState).toEqual(expectedState);
  });

  test('should replace mapping completely with new value on mapping update', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},
        ],
        mappingsCopy: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},

        ],
      },
    };

    const expectedState = {
      mapping: {
        mappings: [
          {key: 'iuhyg', generate: 'bnh', extract: 'we'},
          {key: 'qwe', generate: 'sssw', extract: 'ee'},
        ],
        mappingsCopy: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz'},

        ],
      },
    };

    const newState = reducer(initialState, actions.suiteScript.mapping.updateMappings(
      [
        {key: 'iuhyg', generate: 'bnh', extract: 'we'},
        {key: 'qwe', generate: 'sssw', extract: 'ee'},
      ]
    ));

    expect(newState).toEqual(expectedState);
  });

  test('should clear mapping completely', () => {
    const initialState = {
      mapping: {
        lookups: {},
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {};
    const newState = reducer(initialState, actions.suiteScript.mapping.clear());

    expect(newState).toEqual(expectedState);
  });

  test('should set saveStatus to requested on mapping save ', () => {
    const initialState = {
      mapping: {
        lookups: {},
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: {},
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        saveStatus: 'requested',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.save());

    expect(newState).toEqual(expectedState);
  });

  test('should set saveStatus to failed on mapping save fail ', () => {
    const initialState = {
      mapping: {
        lookups: {},
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: {},
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        saveStatus: 'failed',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.saveFailed());

    expect(newState).toEqual(expectedState);
  });

  test('should set saveStatus to completed and resync mapping on mapping save complete', () => {
    const initialState = {
      mapping: {
        lookups: [],
        lookupsCopy: [],
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        mappingsCopy: [
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [],
        lookupsCopy: [],
        otherProperties: {},
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        mappingsCopy: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        saveStatus: 'completed',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.saveComplete());

    expect(newState).toEqual(expectedState);
  });

  test('should set last touched field correctly', () => {
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
        lastModifiedRowKey: 'key2',
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.updateLastFieldTouched('key2'));

    expect(newState).toEqual(expectedState);
  });

  test('should set alter state while setting validation error message in case state is not initialized', () => {
    const newState = reducer({}, actions.suiteScript.mapping.setValidationMsg());

    expect(newState).toEqual({});
  });
  test('should set validation error message correctly[1]', () => {
    const initialState = {
      mappings: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mappings: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        validationErrMsg: undefined,
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.setValidationMsg());

    expect(newState).toEqual(expectedState);
  });
  test('should set validation error message correctly[2]', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
        validationErrMsg: 'something',
      },
    };
    const newState = reducer(initialState, actions.suiteScript.mapping.setValidationMsg('something'));

    expect(newState).toEqual(expectedState);
  });

  // SET_VALIDATION_MSG
  // TODO PATCH_EXTRACT_LIST
  // TODO SET_SF_SUBLIST_FIELD_NAME
  // TODO check for isKey
  // TODO PATCH_INCOMPLETE_GENERATES
});

describe('Suitescript mapping selectors', () => {
  describe('suiteScriptMapping selectors', () => {
    test('should return empty object in case state is not initialized', () => {
      expect(selectors.suiteScriptMapping(undefined)).toEqual({});
    });

    test('should return mapping object correctly', () => {
      const state = reducer({mapping: {}}, actions.suiteScript.mapping.initComplete({
        something: {},
        mappings: [{a: 'x'}],
      }));

      const {mappings} = selectors.suiteScriptMapping(state);

      expect(mappings).toEqual([{a: 'x', key: expect.anything()}]);
    });
  });

  describe('suiteScriptMappingChanged selectors', () => {
    test('should return true in case mapping order is changed', () => {
      const initialState = {
        mapping: {
          lookups: [],
          lookupsCopy: [],
          mappings: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
          mappingsCopy: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
        },
      };
      const newState = reducer(initialState, actions.suiteScript.mapping.shiftOrder('key3', 0));

      expect(selectors.suiteScriptMappingChanged(newState)).toEqual(true);
    });

    test('should return true in case mapping is changed', () => {
      const initialState = {
        mapping: {
          lookups: [],
          lookupsCopy: [],
          mappings: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
          mappingsCopy: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
        },
      };
      const newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'k2', 'jh'));

      expect(selectors.suiteScriptMappingChanged(newState)).toEqual(true);
    });

    test('should return true in case lookup is changed', () => {
      const initialState = {
        mapping: {
          lookups: [{name: 'a', x: 'y'}],
          lookupsCopy: [{name: 'a', x: 'y'}],
          mappings: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
          mappingsCopy: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
        },
      };
      const newState = reducer(initialState, actions.suiteScript.mapping.updateLookup({
        oldValue: {name: 'a', x: 'y'},
        newValue: {name: 'a', m: 'n'},
      }));

      expect(selectors.suiteScriptMappingChanged(newState)).toEqual(true);
    });

    test('should return false in case mapping is changed and then undo again', () => {
      const initialState = {
        mapping: {
          lookups: [],
          lookupsCopy: [],
          mappings: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
          mappingsCopy: [
            {generate: 'a', extract: 'b', key: 'k1'},
            {generate: 'c', extract: 'd', key: 'k2'},
            {generate: 'e', extract: 'f', key: 'k3'},
          ],
        },
      };
      let newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'k2', 'jh'));

      newState = reducer(initialState, actions.suiteScript.mapping.patchField('extract', 'k2', 'd'));

      expect(selectors.suiteScriptMappingChanged(newState)).toEqual(false);
    });
  });
});

describe('suiteScriptMappingSaveStatus selectors', () => {
  test('selector should return status correctly when state is not initialized', () => {
    const value = selectors.suiteScriptMappingSaveStatus(undefined);

    expect({}).toEqual(value);
  });

  test('selector should return status correctly while saving', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.save({}));
    const result = selectors.suiteScriptMappingSaveStatus(state);

    expect({
      saveCompleted: false,
      saveInProgress: true,
      saveTerminated: false,
    }).toEqual(result);
  });

  test('selector should return status correctly when save fails', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.save({}));
    const newState = reducer(state, actions.suiteScript.mapping.saveFailed({}));

    const result = selectors.suiteScriptMappingSaveStatus(newState);

    expect({
      saveCompleted: false,
      saveInProgress: false,
      saveTerminated: true,
    }).toEqual(result);
  });

  test('selector should return status correctly when save is completed', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.save({}));
    const newState = reducer(state, actions.suiteScript.mapping.saveComplete({}));

    const result = selectors.suiteScriptMappingSaveStatus(newState);

    expect({
      saveCompleted: true,
      saveInProgress: false,
      saveTerminated: true,
    }).toEqual(result);
  });
});

describe('suitesciptMappingExtractGenerateLabel selectors', () => {
  test('selector should return form label correctly[1]', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.initComplete({
      something: {},
      mappings: [],
      options: {
        importType: 'netsuite',
        exportType: 'salesforce',
      },
    }));

    expect(selectors.suitesciptMappingExtractGenerateLabel(state)).toEqual({
      extract: 'Source Record Field (Salesforce)',
      generate: 'Import Field (Netsuite)',
    });
  });

  test('selector should return form label correctly[2]', () => {
    const state = reducer({mapping: {}}, actions.suiteScript.mapping.initComplete({
      something: {},
      mappings: [],
      options: {
        importType: 'xyz',
        exportType: 'rakuten',
      },
    }));

    expect(selectors.suitesciptMappingExtractGenerateLabel(state)).toEqual({
      extract: 'Source Record Field (Rakuten)',
      generate: 'Import Field ',
    });
  });
});
