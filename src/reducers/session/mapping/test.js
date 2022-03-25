/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('mapping reducer', () => {
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
  test('should update the state on init complete', () => {
    const flowId = '123';
    const resourceId = '123';
    const options = {
      lookups: [
        {name: 'lookup1', map: {x: 'y'}},
      ],
      mappings: [
        {key: 'key1', generate: 'xyz1', extract: 'xyz'},
        {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
        {key: 'key3', generate: 'xyz3', extract: 'xyz'},
      ],
      importId: resourceId,
      flowId,
    };

    const state = reducer(undefined, actions.mapping.initComplete(options));
    const expectedState = {
      mapping: {
        mappings: options.mappings,
        lookups: options.lookups,
        flowId,
        importId: resourceId,
        status: 'received',
        mappingsCopy: [
          {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
          {key: 'key3', generate: 'xyz3', extract: 'xyz'},
        ],
        lookupsCopy: [
          {name: 'lookup1', map: {x: 'y'}},
        ],
      },
    };

    expect(state).toEqual(expectedState);
  });
  test('should update the state with error status on init failed', () => {
    const state = reducer(undefined, actions.mapping.initFailed());

    expect(state).toEqual({mapping: {status: 'error' }});
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

  describe('MAPPING.SAVE action', () => {
    test('should set saveStatus to requested if state exists', () => {
      const initialState = {
        mapping: {
        },
      };
      const state = reducer(initialState, actions.mapping.save({}));

      expect(state).toEqual({
        mapping: {
          saveStatus: 'requested',
        },
      });
    });
    test('should delete startKey if autoMapper exists', () => {
      const initialState = {
        mapping: {
          autoMapper: {
            startKey: 'dcdb',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.save({}));

      expect(state).toEqual({
        mapping: {
          autoMapper: {
          },
          saveStatus: 'requested',
        },
      });
    });
  });
  describe('MAPPING.SAVE_COMPLETE action', () => {
    test('should update saveStatus and other fields if state exists', () => {
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
          importId: '123',
          flowId: '123',
          validationErrMsg: 'some error',
        },
      };
      const state = reducer(initialState, actions.mapping.saveComplete());
      const expectedState = {
        mapping: {
          lookups: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          lookupsCopy: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.SAVE_FAILED action', () => {
    test('should update saveStatus and other fields if state exists', () => {
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
          importId: '123',
          flowId: '123',
          validationErrMsg: 'some error',
        },
      };
      const state = reducer(initialState, actions.mapping.saveFailed());
      const expectedState = {
        mapping: {
          lookups: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'failed',
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.PREVIEW_REQUESTED action', () => {
    test('should update preview status if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            status: 'failed',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.requestPreview());
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            status: 'requested',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should update preview status if preview status doesnt exist', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
        },
      };
      const state = reducer(initialState, actions.mapping.requestPreview());
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            status: 'requested',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.PREVIEW_RECEIVED action', () => {
    test('should update preview status and data if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            status: 'requested',
            errors: 'errors',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.previewReceived('some data'));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            data: 'some data',
            status: 'received',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.PREVIEW_FAILED action', () => {
    test('should delete data and update preview status if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            data: 'some data',
            status: 'received',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.previewFailed('errors'));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          preview: {
            status: 'error',
            errors: 'errors',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.SET_NS_ASSISTANT_FORM_LOADED action', () => {
    test('should update isNSAssistantFormLoaded if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
        },
      };
      const state = reducer(initialState, actions.mapping.setNSAssistantFormLoaded('some value'));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          isNSAssistantFormLoaded: 'some value',
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.SET_VALIDATION_MSG action', () => {
    test('should set validation message if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
        },
      };
      const state = reducer(initialState, actions.mapping.setValidationMsg('some validation error'));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          validationErrMsg: 'some validation error',
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.AUTO_MAPPER.REQUEST action', () => {
    test('should set autoMapper state with status requested if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
        },
      };
      const state = reducer(initialState, actions.mapping.autoMapper.request());
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'requested',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should reset autoMapper state with status requested if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            failMsg: 'some message',
            status: 'error',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.autoMapper.request());
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'requested',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.AUTO_MAPPER.RECEIVED action', () => {
    test('should update autoMapper state with mappings if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz1'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'requested',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.autoMapper.received([{key: 'key2', generate: 'xyz2', extract: 'xyz2'}]));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz1'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz2'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'received',
            startKey: 'key2',
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.AUTO_MAPPER.FAILED action', () => {
    test('should set error message and status if state exists', () => {
      const initialState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz2'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'received',
            startKey: 'key2',
          },
        },
      };
      const state = reducer(initialState, actions.mapping.autoMapper.failed(1, 'error msg'));
      const expectedState = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz2'},
          ],
          importId: '123',
          flowId: '123',
          autoMapper: {
            status: 'error',
            startKey: 'key2',
            failMsg: 'error msg',
            failSeverity: 1,
          },
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  test('should do nothing and not fail for all below actions if state does not exist', () => {
    const afterSave = reducer({}, actions.mapping.save({}));
    const afterSaveComplete = reducer(afterSave, actions.mapping.saveComplete());
    const afterSaveFailed = reducer(afterSaveComplete, actions.mapping.saveFailed());
    const afterPreview = reducer(afterSaveFailed, actions.mapping.requestPreview());
    const afterPreviewReceived = reducer(afterPreview, actions.mapping.previewReceived('some data'));
    const afterPreviewFailed = reducer(afterPreviewReceived, actions.mapping.previewFailed());
    const afterNSForm = reducer(afterPreviewFailed, actions.mapping.setNSAssistantFormLoaded('some value'));
    const afterValidation = reducer(afterNSForm, actions.mapping.setValidationMsg('some validation error'));
    const afterAutoMap = reducer(afterValidation, actions.mapping.autoMapper.request());
    const afterAutoMapReceived = reducer(afterAutoMap, actions.mapping.autoMapper.received([{key: 'key2', generate: 'xyz2', extract: 'xyz2'}]));
    const afterAutoMapFailed = reducer(afterAutoMapReceived, actions.mapping.autoMapper.failed(1, 'error msg'));

    expect(afterAutoMapFailed).toEqual({});
  });
});

describe('mapping selectors', () => {
  describe('selectors.mappingChanged', () => {
    test('should return false if state does not exist', () => {
      expect(selectors.mappingChanged()).toEqual(false);
      expect(selectors.mappingChanged(null)).toEqual(false);
      expect(selectors.mappingChanged({})).toEqual(false);
      expect(selectors.mappingChanged({mapping: {}})).toEqual(false);
    });
    test('should return true if mappings changed', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
        },
      };

      expect(selectors.mappingChanged(state)).toEqual(true);
    });
    test('should return true if lookups changed', () => {
      const state = {
        mapping: {
          lookups: [
            {name: 'lookup-new', map: {x: 'y'}},
          ],
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          lookupsCopy: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
        },
      };

      expect(selectors.mappingChanged(state)).toEqual(true);
    });
    test('should return false if nothing changed', () => {
      const state = {
        mapping: {
          lookups: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz', lookupName: 'lookup1'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          lookupsCopy: [
            {name: 'lookup1', map: {x: 'y'}},
          ],
        },
      };

      expect(selectors.mappingChanged(state)).toEqual(false);
    });
  });
  describe('selectors.autoMapper', () => {
    test('should return empty object if state does not exist', () => {
      expect(selectors.autoMapper()).toEqual({});
      expect(selectors.autoMapper(null)).toEqual({});
      expect(selectors.autoMapper({})).toEqual({});
      expect(selectors.autoMapper({mapping: {}})).toEqual({});
    });
    test('should return autoMapper object if exists', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          autoMapper: {
            failMsg: 'some message',
            status: 'error',
          },
        },
      };

      expect(selectors.autoMapper(state)).toEqual({
        failMsg: 'some message',
        status: 'error',
      });
    });
  });
});
