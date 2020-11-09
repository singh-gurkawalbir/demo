/* global describe, test, expect */

import reducer from '.';
import actions from '../../../actions';

describe('Mapping', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should set status to requested on mapping init', () => {
    const flowId = '123';
    const resourceId = '123';
    const state = reducer(undefined, actions.mapping.init({
      flowId,
      resourceId,
    }));

    expect({mapping: {status: 'requested'}}).toEqual(state);
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
    const newState = reducer(initialState, actions.mapping.updateLastFieldTouched('key2'));

    expect(expectedState).toEqual(newState);
  });
  test('should delete mapping', () => {
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
    const newState = reducer(initialState, actions.mapping.delete('key2'));

    expect(expectedState).toEqual(newState);
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
    const newState = reducer(initialState, actions.mapping.delete('key2'));

    expect(expectedState).toEqual(newState);
  });

  test('should create new row with generate value while patching new generate', () => {
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
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('generate', 'new', 'xyz3'));

    expect(expectedState).toEqual(newState);
  });

  test('should patch generate value correctly against key and set last modified key', () => {
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'newValue', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('generate', 'key2', 'newValue'));

    expect(expectedState).toEqual(newState);
  });

  test('should patch extract value correctly against key and set last modified key', () => {
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'newValue'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('extract', 'key2', 'newValue'));

    expect(expectedState).toEqual(newState);
  });

  test('should create new row with extract value while patching new extract', () => {
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
        lastModifiedRowKey: expect.anything(),
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('extract', 'new', 'xyz3'));

    expect(expectedState).toEqual(newState);
  });

  test('should patch hardcoded extract correctly', () => {
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
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz3'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('extract', 'key2', '"xyz3"'));

    expect(expectedState).toEqual(newState);
  });

  test('should patch hardcoded extract correctly', () => {
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
          {key: 'key2', generate: 'xyz2', hardCodedValue: 'xyz3'},
        ],
        lastModifiedRowKey: 'key2',
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('extract', 'key2', '"xyz3"'));

    expect(expectedState).toEqual(newState);
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz', lookupName: 'lookupName'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { lookupName: 'lookupName'};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
  });

  test('should patch multi-field correctly', () => {
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
          {key: 'key1', generate: 'xyz1', discardIfEmpty: true, immutable: true, extract: '{{Base Price}}'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { discardIfEmpty: true, immutable: true, extract: '{{Base Price}}'};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
  });
  test('should patch conditional mapping settings correctly', () => {
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz', conditional: {when: 'extract_not_empty'}},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { conditional: {when: 'extract_not_empty'}};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
  });

  test('should set extract as null as default value when set from settings', () => {
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
          {key: 'key1', generate: 'xyz1', extract: null},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { extract: null};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
  });

  test('should set/unset extractDateFormat and extractDateTimezone correctly', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz' },
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz', extractDateFormat: 'MMDDYY', extractDateTimezone: 'Etc/GMT+1' },
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = {extractDateFormat: 'MMDDYY', extractDateTimezone: 'Etc/GMT+1'};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
    const expectedNextState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const newSettings = {};
    const nextState = reducer(initialState, actions.mapping.patchSettings('key1', newSettings));

    expect(expectedNextState).toEqual(nextState);
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
          {key: 'key1', generate: 'xyz1', extract: 'xyz', lookupName: 'lookupName'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
        lastModifiedRowKey: 'key1',
      },
    };
    const settings = { lookupName: 'lookupName'};
    const newState = reducer(initialState, actions.mapping.patchSettings('key1', settings));

    expect(expectedState).toEqual(newState);
  });
  test('should change order of mapping correctly while dragging', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          {key: 'key4', generate: 'xyz4', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key4', generate: 'xyz4', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.shiftOrder('key4', 1));

    expect(expectedState).toEqual(newState);
  });
  test('should add lookup to lookup list', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup2', map: {x: 'y'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.addLookup({value: {name: 'lookup2', map: {x: 'y'}}}));

    expect(expectedState).toEqual(newState);
  });
  test('should add conditional lookup to lookup list with isConditionalLookup set to true', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup2', map: {x: 'y'}, isConditionalLookup: true},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.addLookup({value: {name: 'lookup2', map: {x: 'y'}}, isConditionalLookup: true}));

    expect(expectedState).toEqual(newState);
  });

  test('should remove mapping item correctly while delete and item', () => {
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
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.delete('key1'));

    expect(expectedState).toEqual(newState);
  });
  test('should delete lookup if particular mapping item is removed from mapping', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz', lookupName: 'lookup1'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [],
        mappings: [
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.delete('key1'));

    expect(expectedState).toEqual(newState);
  });
  test('should update lookup correctly', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup2', map: {x: 'y'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup3', map: {v: 'h'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.updateLookup({
      oldValue: {name: 'lookup2'},
      newValue: {name: 'lookup3', map: {v: 'h'}},
    }));

    expect(expectedState).toEqual(newState);
  });

  test('should update conditional lookup correctly and change reference in all mappings using it', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup2', map: {x: 'y'}, isConditionalLookup: true},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz', conditional: {lookupName: 'lookup2'}},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz', conditional: {lookupName: 'lookup2'}},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup3', map: {v: 'h'}, isConditionalLookup: true},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz', conditional: {lookupName: 'lookup3'}},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz', conditional: {lookupName: 'lookup3'}},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.updateLookup({
      oldValue: {name: 'lookup2'},
      newValue: {name: 'lookup3', map: {v: 'h'}},
      isConditionalLookup: true,
    }));

    expect(expectedState).toEqual(newState);
  });

  test('should update mapping list on update correctly', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key4', generate: 'xyz11', extract: 'xyz'},
          {key: 'key5', generate: 'xyz12', extract: 'xyz'},
          {key: 'key6', generate: 'xyz13', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.updateMappings([{key: 'key4', generate: 'xyz11', extract: 'xyz'},
      {key: 'key5', generate: 'xyz12', extract: 'xyz'},
      {key: 'key6', generate: 'xyz13', extract: 'xyz'}]));

    expect(expectedState).toEqual(newState);
  });
  test('should set last touched field correctly', () => {
    const initialState = {
      mapping: {
      },
    };
    const expectedState = {
      mapping: {
        lastModifiedRowKey: 'abcd',
      },
    };
    const newState = reducer(initialState, actions.mapping.updateLastFieldTouched('abcd'));

    expect(expectedState).toEqual(newState);
  });
  test('should delete associated lookup and unset last tocuhed field while deleting particular row ', () => {
    const initialState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
          {name: 'lookup2', map: {c: 'd'}},
        ],
        lastModifiedRowKey: 'key2',
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup2'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lookups: [
          {name: 'lookup1', map: {a: 'b'}},
        ],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.delete('key2'));

    expect(expectedState).toEqual(newState);
  });
  test('should delete isKey in case generate changes from sublist to field item ', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'xyz', isKey: true},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lastModifiedRowKey: 'key1',
        mappings: [
          {key: 'key1', generate: 'abcd', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('generate', 'key1', 'abcd'));

    expect(expectedState).toEqual(newState);
  });
  test('should delete useFirstRow in case generate changes from sublist to field item ', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'xyz', useFirstRow: true},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lastModifiedRowKey: 'key1',
        mappings: [
          {key: 'key1', generate: 'abcd', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('generate', 'key1', 'abcd'));

    expect(expectedState).toEqual(newState);
  });
  test('should not update generate in case field is set required', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'xyz', isRequired: true},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'xyz', isRequired: true },
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('generate', 'key1', 'abcd'));

    expect(expectedState).toEqual(newState);
  });
  test('should update extract in case field is set required', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'xyz', isRequired: true},
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        lastModifiedRowKey: 'key1',
        mappings: [
          {key: 'key1', generate: 'a[*].abcd', extract: 'abcd', isRequired: true },
          {key: 'key2', generate: 'xyz2', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchField('extract', 'key1', 'abcd'));

    expect(expectedState).toEqual(newState);
  });

  test('should add key and value to incompleteGenerates set property', () => {
    const initialState = {
      mapping: {
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        incompleteGenerates: [{key: 'key1', value: 'test'}],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchIncompleteGenerates('key1', 'test'));

    expect(expectedState).toEqual(newState);
  });
  test('should update value against key for incompleteGenerates if key is already present', () => {
    const initialState = {
      mapping: {
        incompleteGenerates: [{key: 'key1', value: 'test'}],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const expectedState = {
      mapping: {
        incompleteGenerates: [{key: 'key1', value: 'changed'}],
        mappings: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        ],
      },
    };
    const newState = reducer(initialState, actions.mapping.patchIncompleteGenerates('key1', 'changed'));

    expect(expectedState).toEqual(newState);
  });
  test('should clear mapping correctly', () => {
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
    const newState = reducer(initialState, actions.mapping.clear());

    expect(expectedState).toEqual(newState);
  });
});
