/* global describe, test, expect, jest */
import reducer, { selectors, expandRow, updateChildrenProps, updateDataType } from '.';
import actions from '../../../actions';
import {MAPPING_DATA_TYPES} from '../../../utils/mapping';
import {generateUniqueKey} from '../../../utils/string';

jest.mock('../../../utils/string');

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
        expandedKeys: [],
        isGroupedOutput: false,
      },
    };

    expect(state).toEqual(expectedState);
  });
  test('should update the state on init complete with v2 data and isGroupedOutput as true', () => {
    const flowId = '123';
    const resourceId = '123';
    const options = {
      importId: resourceId,
      flowId,
      v2TreeData: [{
        key: '123',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        buildArrayHelper: [],
      }],
    };

    const state = reducer(undefined, actions.mapping.initComplete(options));
    const expectedState = {
      mapping: {
        v2TreeData: [{
          key: '123',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generateDisabled: true,
          buildArrayHelper: [],
        }],
        isGroupedOutput: true,
        flowId,
        importId: resourceId,
        status: 'received',
        v2TreeDataCopy: [{
          key: '123',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generateDisabled: true,
          buildArrayHelper: [],
        }],
        expandedKeys: ['123'],
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
  describe('MAPPING.TOGGLE_VERSION action', () => {
    test('should correctly update the version', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 1,
        },
      };
      const state = reducer(initialState, actions.mapping.toggleVersion(2));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.TOGGLE_OUTPUT action', () => {
    test('should do nothing if old and new formats are same', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('rows'));

      expect(state).toBe(initialState);
    });
    test('should only update isGroupedOutput flag if new format is rows and a root disabled row already exists', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: false,
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            children: [],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('rows'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            children: [],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly insert parent node if new format is rows', () => {
      generateUniqueKey.mockReturnValue('new-key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: false,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.lname',
            generate: 'lname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('rows'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
          expandedKeys: [
            'new-key',
          ],
          v2TreeData: [{
            key: 'new-key',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            title: '',
            children: [{
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.fname',
              generate: 'fname',
              isEmptyRow: false,
              parentExtract: '',
              parentKey: 'new-key',
            },
            {
              key: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.lname',
              generate: 'lname',
              isEmptyRow: false,
              parentExtract: '',
              parentKey: 'new-key',
            }],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should only update isGroupedOutput flag if new format is record and a root disabled row does not exist', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('record'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: false,
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly remove parent node if new format is record', () => {
      generateUniqueKey.mockReturnValue('new-key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
          v2TreeData: [{
            key: 'new-key',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            combinedExtract: '$',
            title: '',
            children: [{
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.fname',
              generate: 'fname',
              isEmptyRow: false,
              parentExtract: '$|0',
              parentKey: 'new-key',
            },
            {
              key: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.lname',
              generate: 'lname',
              isEmptyRow: false,
              parentExtract: '$|0',
              parentKey: 'new-key',
            }],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('record'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: false,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.lname',
            generate: 'lname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly add empty row if no matching children were found for record format', () => {
      generateUniqueKey.mockReturnValue('new-key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: true,
          v2TreeData: [{
            key: 'new-key',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            combinedExtract: '',
            title: '',
            children: [{
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleOutput('record'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          isGroupedOutput: false,
          v2TreeData: [{
            key: 'new-key',
            title: '',
            dataType: MAPPING_DATA_TYPES.STRING,
            isEmptyRow: true,
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.TOGGLE_ROWS action', () => {
    test('should set expandedKeys as empty array if passed flag is false', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['some_key'],
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
            children: [],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleRows(false));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: [],
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
            children: [],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should set expandedKeys as all parent keys if passed flag is true', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: [],
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
            children: [{
              key: 'c1_key',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.fname',
              generate: 'fname',
              children: [{
                key: 'c2_key',
                dataType: MAPPING_DATA_TYPES.STRING,
                extract: '$.fname',
                generate: 'fname',
              }],
            }],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.toggleRows(true));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['c2_key', 'c1_key', 'some_key'],
          v2TreeData: [{
            key: 'some_key',
            dataType: MAPPING_DATA_TYPES.STRING,
            extract: '$.fname',
            generate: 'fname',
            children: [{
              key: 'c1_key',
              dataType: MAPPING_DATA_TYPES.STRING,
              extract: '$.fname',
              generate: 'fname',
              children: [{
                key: 'c2_key',
                dataType: MAPPING_DATA_TYPES.STRING,
                extract: '$.fname',
                generate: 'fname',
              }],
            }],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.UPDATE_EXPANDED_KEYS action', () => {
    test('should reset expandedKeys with the passed new keys', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1', 'key2', 'key3'],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.updateExpandedKeys(['key2', 'key4']));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key2', 'key4'],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.DELETE_ROW action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteRow('key1'));

      expect(state).toBe(initialState);
    });
    test('should delete the row from the tree data', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'lname',
            extract: '$.lname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteRow('key1'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'lname',
              extract: '$.lname',
            }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should delete the row from the tree data and insert empty row if all mappings are removed', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteRow('key1'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'new_key',
              title: '',
              dataType: MAPPING_DATA_TYPES.STRING,
              isEmptyRow: true,
            }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.ADD_ROW action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.addRow('key1'));

      expect(state).toBe(initialState);
    });
    test('should add a new row at next sibling index of the passed row', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            children: [{
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: '$.child1',
              parentKey: 'key2',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: '$.child2',
              parentKey: 'key2',
            }],
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test',
            extract: '$.test',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.addRow('c1'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          newRowKey: 'new_key',
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            children: [{
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: '$.child1',
              parentKey: 'key2',
            },
            {
              key: 'new_key',
              title: '',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: '$.child2',
              parentKey: 'key2',
            }],
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test',
            extract: '$.test',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.UPDATE_DATA_TYPE action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.updateDataType('key1', MAPPING_DATA_TYPES.STRING));

      expect(state).toBe(initialState);
    });
    test('should correctly update the new data type as string', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            isEmptyRow: true,
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.updateDataType('key1', MAPPING_DATA_TYPES.NUMBER));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.NUMBER,
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly update the new data type as object', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRINGARRAY,
            generate: 'names',
            combinedExtract: '$.name1,$.name2',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.updateDataType('key1', MAPPING_DATA_TYPES.OBJECT));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1'],
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'names',
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'key1',
              parentExtract: '',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.DRAG_DROP action', () => {
    test('should do nothing if drop index is same as the original row index', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'lname',
            extract: '$.lname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'lname',
          extract: '$.lname',
          pos: '0-1',
        },
        node: {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
          extract: '$.fname',
          pos: '0-0',
        },
      }));

      expect(state).toBe(initialState);
    });
    test('should correctly insert dragged node to the new position when no children are involved[1]', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'lname',
            extract: '$.lname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: -1,
        dragNode: {
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'lname',
          extract: '$.lname',
          key: 'key2',
          pos: '0-1',
        },
        node: {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
          extract: '$.fname',
          pos: '0-0',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'lname',
              extract: '$.lname',
              jsonPath: 'lname',
            },
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly insert dragged node to the new position when no children are involved[2]', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test1',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test2',
            extract: '$.lname',
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test3',
            extract: '$.fname',
          },
          {
            key: 'key4',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test4',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 3,
        dragNode: {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test2',
          extract: '$.lname',
          pos: '0-1',
        },
        node: {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test3',
          extract: '$.fname',
          pos: '0-2',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test1',
            extract: '$.fname',
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test3',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test2',
            extract: '$.lname',
            jsonPath: 'test2',
          },
          {
            key: 'key4',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test4',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly insert dragged node to the new position when no children are involved[3]', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test1',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test2',
            extract: '$.lname',
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test3',
            extract: '$.fname',
          },
          {
            key: 'key4',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test4',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test3',
          extract: '$.fname',
          pos: '0-2',
        },
        node: {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test1',
          extract: '$.fname',
          pos: '0-0',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test1',
            extract: '$.fname',
          },
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test3',
            extract: '$.fname',
            jsonPath: 'test3',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test2',
            extract: '$.lname',
          },
          {
            key: 'key4',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'test4',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should do nothing if drop index is same as the original row index in children array', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                parentKey: 'key2',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          dataType: MAPPING_DATA_TYPES.STRING,
          extract: '$.child1',
          generate: 'child1',
          key: 'c1',
          parentExtract: '',
          parentKey: 'key2',
          pos: '0-1-0',
        },
        node: {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'lname',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: '$.child1',
              parentExtract: '',
              parentKey: 'key2',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: '$.child2',
              parentExtract: '',
              parentKey: 'key2',
            },
          ],
          pos: '0-1',
        },
      }));

      expect(state).toBe(initialState);
    });
    test('should correctly insert dragged node to the new position within children array', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            jsonPath: 'lname',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                parentKey: 'key2',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '',
                parentKey: 'key2',
              },
              {
                key: 'c3',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child3',
                extract: '$.child3',
                parentExtract: '',
                parentKey: 'key3',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          key: 'c3',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'child3',
          extract: '$.child3',
          parentExtract: '',
          parentKey: 'key3',
          pos: '0-1-2',
        },
        node: {
          key: 'c1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'child1',
          extract: '$.child1',
          parentExtract: '',
          parentKey: 'key2',
          pos: '0-1-0',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            jsonPath: 'lname',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                parentKey: 'key2',
              },
              {
                key: 'c3',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child3',
                extract: '$.child3',
                parentExtract: '',
                parentKey: 'key2',
                jsonPath: 'lname.child3',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly insert dragged node when the drop position is 0th in children array', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            jsonPath: 'lname',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                parentKey: 'key2',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          dataType: MAPPING_DATA_TYPES.STRING,
          extract: '$.child2',
          generate: 'child2',
          key: 'c2',
          parentExtract: '',
          parentKey: 'key2',
          pos: '0-1-1',
        },
        node: {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'lname',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: '$.child1',
              parentExtract: '',
              parentKey: 'key2',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: '$.child2',
              parentExtract: '',
              parentKey: 'key2',
            },
          ],
          pos: '0-1',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            generate: 'lname',
            jsonPath: 'lname',
            children: [
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '',
                parentKey: 'key2',
                jsonPath: 'lname.child2',
              },
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly insert dragged node when the drop position is 0th in children array for object array parent', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'mothers_side',
            combinedExtract: '$.siblings[*],$.children[*]',
            activeTab: 0,
            jsonPath: 'mothers_side',
            children: [
              {
                key: 'c1',
                isTabNode: true,
                parentKey: 'key2',
              },
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '$.siblings[*]',
                parentKey: 'key2',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '$.siblings[*]',
                parentKey: 'key2',
              },
              {
                key: 'c3',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child3',
                extract: '$.child3',
                parentExtract: '$.children[*]',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.dropRow({
        dropPosition: 1,
        dragNode: {
          key: 'c2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'child2',
          extract: '$.child2',
          parentExtract: '$.siblings[*]',
          parentKey: 'key2',
          pos: '0-1-2',
        },
        node: {
          key: 'c1',
          isTabNode: true,
          parentKey: 'key2',
          pos: '0-1-0',
        },

      }));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          },
          {
            key: 'key2',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'mothers_side',
            combinedExtract: '$.siblings[*],$.children[*]',
            activeTab: 0,
            jsonPath: 'mothers_side',
            children: [
              {
                key: 'c1',
                isTabNode: true,
                parentKey: 'key2',
              },
              {
                key: 'c2',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child2',
                extract: '$.child2',
                parentExtract: '$.siblings[*]',
                parentKey: 'key2',
                jsonPath: 'mothers_side[*].child2',
              },
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '$.siblings[*]',
                parentKey: 'key2',
              },
              {
                key: 'c3',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child3',
                extract: '$.child3',
                parentExtract: '$.children[*]',
                parentKey: 'key2',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.PATCH_FIELD action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', 'new-value'));

      expect(state).toBe(initialState);
    });
    test('should do nothing if isRequired is true and patch is for generate field', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
            isRequired: true,
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('generate', 'key1', 'new-value'));

      expect(state).toBe(initialState);
    });
    test('should correctly update the generate field', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
            isEmptyRow: true,
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('generate', 'key1', 'new-fname'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'new-fname',
            jsonPath: 'new-fname',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly update the generate field with jsonPath', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'siblings',
            jsonPath: 'siblings',
            extract: '$.siblings[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                parentKey: 'key1',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('generate', 'c1', 'child-name'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'siblings',
            jsonPath: 'siblings',
            extract: '$.siblings[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child-name',
                jsonPath: 'siblings[*].child-name',
                parentKey: 'key1',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should correctly update the generate field with jsonPath for children also', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'siblings',
            jsonPath: 'siblings',
            extract: '$.siblings[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                parentKey: 'key1',
                generate: 'abc',
                jsonPath: 'siblings[*].abc',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('generate', 'key1', 'new-value'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'new-value',
            jsonPath: 'new-value',
            extract: '$.siblings[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                parentKey: 'key1',
                generate: 'abc',
                jsonPath: 'new-value[*].abc',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch hard-coded extract correctly', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', '"custom value"'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            hardCodedValue: 'custom value',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch non hard-coded extract correctly if data type is not of array types', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            hardCodedValue: 'custom value',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', '$.fname'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch extract correctly when copy source is yes and remove all children', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            copySource: 'yes',
            generate: 'fname',
            extract: '$.fname[*]',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', '$.siblings[*]'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            copySource: 'yes',
            generate: 'fname',
            combinedExtract: '$.siblings[*]',
            children: [],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should update correctly when new extract is empty and data type is object array', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'fname',
            combinedExtract: '$.fname[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentKey: 'key1',
                parentExtract: '$.fname[*]',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', ''));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'fname',
            combinedExtract: '',
            activeTab: 0,
            children: [
              {
                key: 'c1',
                parentKey: 'key1',
                generate: 'child1',
                extract: '$.child1',
                parentExtract: '',
                dataType: MAPPING_DATA_TYPES.STRING,
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should update correctly when new extract is not empty and data type is object array', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'fname',
            combinedExtract: '$.fname[*]',
            children: [
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentKey: 'key1',
                parentExtract: '$.fname[*]',
              },
            ],
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchField('extract', 'key1', '$.fname[*],$.lname[*]'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generate: 'fname',
            combinedExtract: '$.fname[*],$.lname[*]',
            activeTab: 0,
            children: [
              {
                key: 'new_key',
                parentKey: 'key1',
                isTabNode: true,
                title: '',
              },
              {
                key: 'c1',
                dataType: MAPPING_DATA_TYPES.STRING,
                generate: 'child1',
                extract: '$.child1',
                parentKey: 'key1',
                parentExtract: '$.fname[*]',
              },
              {
                key: 'new_key',
                title: '',
                parentKey: 'key1',
                generate: 'child1',
                parentExtract: '$.lname[*]',
                dataType: MAPPING_DATA_TYPES.STRING,
                hidden: true,
                className: 'hideRow',
              },
            ],
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.PATCH_SETTINGS action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', {extract: 'test'}));

      expect(state).toBe(initialState);
    });
    test('should patch settings correctly if lookup is defined', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.STRING, lookupName: 'new-lookup'};
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
              lookupName: 'new-lookup',
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch multi-field correctly', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              hardCodedValue: 'some value',
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.STRING, extract: '{{Base Price}}'};
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '{{Base Price}}',
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch conditional mapping settings correctly', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.STRING, conditional: {when: 'extract_not_empty'}};
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
              conditional: {when: 'extract_not_empty'},
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch hard-coded value correctly', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
              default: 'testing',
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.STRING, hardCodedValue: null };
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              hardCodedValue: null,
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should patch new data type correctly', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generate: 'mothers_side',
              combinedExtract: '$.siblings[*],$.children[*]',
              activeTab: 0,
              children: [
                {
                  key: 'c1',
                  isTabNode: true,
                  parentKey: 'key2',
                },
                {
                  key: 'c2',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child2',
                  extract: '$.child2',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c1',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child1',
                  extract: '$.child1',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c3',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child3',
                  extract: '$.child3',
                  parentExtract: '$.children[*]',
                  parentKey: 'key2',
                },
              ],
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.OBJECT };
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1'],
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'mothers_side',
              children: [
                {
                  key: 'new_key',
                  title: '',
                  parentKey: 'key1',
                  parentExtract: '',
                  dataType: MAPPING_DATA_TYPES.STRING,
                },
              ],
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should remove all children if copySource is yes', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generate: 'mothers_side',
              combinedExtract: '$.siblings[*],$.children[*]',
              activeTab: 0,
              children: [
                {
                  key: 'c1',
                  isTabNode: true,
                  parentKey: 'key2',
                },
                {
                  key: 'c2',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child2',
                  extract: '$.child2',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c1',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child1',
                  extract: '$.child1',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c3',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child3',
                  extract: '$.child3',
                  parentExtract: '$.children[*]',
                  parentKey: 'key2',
                },
              ],
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.OBJECTARRAY, copySource: 'yes' };
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generate: 'mothers_side',
              combinedExtract: '$.siblings[*],$.children[*]',
              activeTab: 0,
              copySource: 'yes',
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
    test('should add empty child row if copySource is no and children do not exist', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'mothers_side',
              extract: '$.mothers',
            },
          ],
        },
      };
      const settings = { dataType: MAPPING_DATA_TYPES.OBJECT, copySource: 'no' };
      const state = reducer(initialState, actions.mapping.v2.patchSettings('key1', settings));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1'],
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'mothers_side',
              copySource: 'no',
              children: [
                {
                  key: 'new_key',
                  title: '',
                  parentKey: 'key1',
                  parentExtract: '',
                  dataType: MAPPING_DATA_TYPES.STRING,
                },
              ],
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.ACTIVE_KEY action', () => {
    test('should correctly update the active key', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2ActiveKey: '',
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.updateActiveKey('key1'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2ActiveKey: 'key1',
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.CHANGE_ARRAY_TAB action', () => {
    test('should do nothing if row is not found', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.changeArrayTab('key1', 0, '$.fname'));

      expect(state).toBe(initialState);
    });
    test('should correctly update the activeTab and hide other tab children', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generate: 'mothers_side',
              combinedExtract: '$.siblings[*],$.children[*]',
              activeTab: 0,
              children: [
                {
                  key: 'c1',
                  isTabNode: true,
                  parentKey: 'key2',
                },
                {
                  key: 'c2',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child2',
                  extract: '$.child2',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c1',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child1',
                  extract: '$.child1',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                },
                {
                  key: 'c3',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child3',
                  extract: '$.child3',
                  parentExtract: '$.children[*]',
                  parentKey: 'key2',
                },
              ],
            },
          ],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.changeArrayTab('key1', 1, '$.children[*]'));
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generate: 'mothers_side',
              combinedExtract: '$.siblings[*],$.children[*]',
              activeTab: 1,
              children: [
                {
                  key: 'c1',
                  isTabNode: true,
                  parentKey: 'key2',
                },
                {
                  key: 'c2',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child2',
                  extract: '$.child2',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                  hidden: true,
                  className: 'hideRow',
                },
                {
                  key: 'c1',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child1',
                  extract: '$.child1',
                  parentExtract: '$.siblings[*]',
                  parentKey: 'key2',
                  hidden: true,
                  className: 'hideRow',
                },
                {
                  key: 'c3',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'child3',
                  extract: '$.child3',
                  parentExtract: '$.children[*]',
                  parentKey: 'key2',
                },
              ],
            },
          ],
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
  describe('MAPPING.V2.PATCH_EXTRACTS_FILTER', () => {
    const extractsTree = [
      {
        key: 'k1',
        dataType: 'object',
        propName: '$',
        children: [
          {
            key: 'c1',
            parentKey: 'k1',
            jsonPath: 'entity',
            propName: 'entity',
            dataType: 'string',
          },
          {
            key: 'c2',
            parentKey: 'k1',
            jsonPath: 'items[*]',
            propName: 'items',
            dataType: '[object]',
            children: [
              {
                key: 'c2-1',
                parentKey: 'c2',
                jsonPath: 'items[*].celigo_inventorydetail',
                propName: 'celigo_inventorydetail',
                dataType: 'object',
                children: [
                  {
                    key: 'c2-1-1',
                    parentKey: 'c2-1',
                    jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*]',
                    propName: 'inventoryassignment',
                    dataType: '[object]',
                    children: [
                      {
                        key: 'c2-1-1-1',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].quantity',
                        propName: 'quantity',
                        dataType: 'number',
                      },
                      {
                        key: 'c2-1-1-2',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].sno',
                        propName: 'sno',
                        dataType: 'string',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'c2-2',
                parentKey: 'c2',
                jsonPath: 'items[*].item',
                propName: 'item',
                dataType: 'string',
              },
              {
                key: 'c2-3',
                parentKey: 'c2',
                jsonPath: 'items[*].quantity',
                propName: 'quantity',
                dataType: 'number',
              },
            ],
          },
          {
            key: 'c3',
            parentKey: 'k1',
            jsonPath: 'location',
            propName: 'location',
            dataType: 'number',
          },
        ],
      },
    ];

    test('should do nothing if no extracts tree is present in state', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.input', '$.prop'));

      expect(state).toBe(initialState);
    });
    test('should un-hide all nodes if input values matches extract value', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.entity', '$.entity'));

      expect(state).toEqual(initialState);
    });
    test('should un-hide all nodes if input value has last character as comma', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.entity,', '$.new'));

      expect(state).toEqual(initialState);
    });
    test('should correctly update extracts tree if input contain multiple comma separated value', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const expectedTree = [{
        key: 'k1',
        dataType: 'object',
        propName: '$',
        children: [
          {
            key: 'c1',
            parentKey: 'k1',
            jsonPath: 'entity',
            propName: 'entity',
            dataType: 'string',
          },
          {
            key: 'c2',
            parentKey: 'k1',
            jsonPath: 'items[*]',
            propName: 'items',
            dataType: '[object]',
            children: [
              {
                key: 'c2-1',
                parentKey: 'c2',
                jsonPath: 'items[*].celigo_inventorydetail',
                propName: 'celigo_inventorydetail',
                dataType: 'object',
                children: [
                  {
                    key: 'c2-1-1',
                    parentKey: 'c2-1',
                    jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*]',
                    propName: 'inventoryassignment',
                    dataType: '[object]',
                    children: [
                      {
                        key: 'c2-1-1-1',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].quantity',
                        propName: 'quantity',
                        dataType: 'number',
                        hidden: true,
                        className: 'hideRow',
                      },
                      {
                        key: 'c2-1-1-2',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].sno',
                        propName: 'sno',
                        dataType: 'string',
                        hidden: true,
                        className: 'hideRow',
                      },
                    ],
                    hidden: true,
                    className: 'hideRow',
                  },
                ],
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-2',
                parentKey: 'c2',
                jsonPath: 'items[*].item',
                propName: 'item',
                dataType: 'string',
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-3',
                parentKey: 'c2',
                jsonPath: 'items[*].quantity',
                propName: 'quantity',
                dataType: 'number',
                hidden: true,
                className: 'hideRow',
              },
            ],
            hidden: true,
            className: 'hideRow',
          },
          {
            key: 'c3',
            parentKey: 'k1',
            jsonPath: 'location',
            propName: 'location',
            dataType: 'number',
          },
        ],
        childMatchFound: true,
      }];

      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.entity,$.location', '$.entity'));
      const nextState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree: expectedTree,
        },
      };

      expect(state).toEqual(nextState);
    });
    test('should correctly update extracts tree with parent hidden if no children are visible', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const expectedTree = [{
        key: 'k1',
        dataType: 'object',
        propName: '$',
        children: [
          {
            key: 'c1',
            parentKey: 'k1',
            jsonPath: 'entity',
            propName: 'entity',
            dataType: 'string',
          },
          {
            key: 'c2',
            parentKey: 'k1',
            jsonPath: 'items[*]',
            propName: 'items',
            dataType: '[object]',
            children: [
              {
                key: 'c2-1',
                parentKey: 'c2',
                jsonPath: 'items[*].celigo_inventorydetail',
                propName: 'celigo_inventorydetail',
                dataType: 'object',
                children: [
                  {
                    key: 'c2-1-1',
                    parentKey: 'c2-1',
                    jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*]',
                    propName: 'inventoryassignment',
                    dataType: '[object]',
                    children: [
                      {
                        key: 'c2-1-1-1',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].quantity',
                        propName: 'quantity',
                        dataType: 'number',
                        hidden: true,
                        className: 'hideRow',
                      },
                      {
                        key: 'c2-1-1-2',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].sno',
                        propName: 'sno',
                        dataType: 'string',
                        hidden: true,
                        className: 'hideRow',
                      },
                    ],
                    hidden: true,
                    className: 'hideRow',
                  },
                ],
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-2',
                parentKey: 'c2',
                jsonPath: 'items[*].item',
                propName: 'item',
                dataType: 'string',
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-3',
                parentKey: 'c2',
                jsonPath: 'items[*].quantity',
                propName: 'quantity',
                dataType: 'number',
                hidden: true,
                className: 'hideRow',
              },
            ],
            hidden: true,
            className: 'hideRow',
          },
          {
            key: 'c3',
            parentKey: 'k1',
            jsonPath: 'location',
            propName: 'location',
            dataType: 'number',
            hidden: true,
            className: 'hideRow',
          },
        ],
        childMatchFound: true,
      }];

      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.entity', '$.items'));
      const nextState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree: expectedTree,
        },
      };

      expect(state).toEqual(nextState);
    });
    test('should correctly update extracts tree with parent visible and only matching children if parent did not match', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const expectedTree = [{
        key: 'k1',
        dataType: 'object',
        propName: '$',
        children: [
          {
            key: 'c1',
            parentKey: 'k1',
            jsonPath: 'entity',
            propName: 'entity',
            dataType: 'string',
            hidden: true,
            className: 'hideRow',
          },
          {
            key: 'c2',
            parentKey: 'k1',
            jsonPath: 'items[*]',
            propName: 'items',
            dataType: '[object]',
            childMatchFound: true,
            children: [
              {
                key: 'c2-1',
                parentKey: 'c2',
                jsonPath: 'items[*].celigo_inventorydetail',
                propName: 'celigo_inventorydetail',
                dataType: 'object',
                childMatchFound: true,
                children: [
                  {
                    key: 'c2-1-1',
                    parentKey: 'c2-1',
                    jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*]',
                    propName: 'inventoryassignment',
                    dataType: '[object]',
                    childMatchFound: true,
                    children: [
                      {
                        key: 'c2-1-1-1',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].quantity',
                        propName: 'quantity',
                        dataType: 'number',
                        hidden: true,
                        className: 'hideRow',
                      },
                      {
                        key: 'c2-1-1-2',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].sno',
                        propName: 'sno',
                        dataType: 'string',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'c2-2',
                parentKey: 'c2',
                jsonPath: 'items[*].item',
                propName: 'item',
                dataType: 'string',
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-3',
                parentKey: 'c2',
                jsonPath: 'items[*].quantity',
                propName: 'quantity',
                dataType: 'number',
                hidden: true,
                className: 'hideRow',
              },
            ],
          },
          {
            key: 'c3',
            parentKey: 'k1',
            jsonPath: 'location',
            propName: 'location',
            dataType: 'number',
            hidden: true,
            className: 'hideRow',
          },
        ],
        childMatchFound: true,
      }];

      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.sno', '$.items'));
      const nextState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree: expectedTree,
        },
      };

      expect(state).toEqual(nextState);
    });
    test('should correctly update extracts tree with parent visible and all children if only parent matched', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree,
        },
      };
      const expectedTree = [{
        key: 'k1',
        dataType: 'object',
        propName: '$',
        children: [
          {
            key: 'c1',
            parentKey: 'k1',
            jsonPath: 'entity',
            propName: 'entity',
            dataType: 'string',
            hidden: true,
            className: 'hideRow',
          },
          {
            key: 'c2',
            parentKey: 'k1',
            jsonPath: 'items[*]',
            propName: 'items',
            dataType: '[object]',
            childMatchFound: true,
            children: [
              {
                key: 'c2-1',
                parentKey: 'c2',
                jsonPath: 'items[*].celigo_inventorydetail',
                propName: 'celigo_inventorydetail',
                dataType: 'object',
                childMatchFound: true,
                children: [
                  {
                    key: 'c2-1-1',
                    parentKey: 'c2-1',
                    jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*]',
                    propName: 'inventoryassignment',
                    dataType: '[object]',
                    childMatchFound: true,
                    children: [
                      {
                        key: 'c2-1-1-1',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].quantity',
                        propName: 'quantity',
                        dataType: 'number',
                      },
                      {
                        key: 'c2-1-1-2',
                        parentKey: 'c2-1-1',
                        jsonPath: 'items[*].celigo_inventorydetail.inventoryassignment[*].sno',
                        propName: 'sno',
                        dataType: 'string',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'c2-2',
                parentKey: 'c2',
                jsonPath: 'items[*].item',
                propName: 'item',
                dataType: 'string',
                hidden: true,
                className: 'hideRow',
              },
              {
                key: 'c2-3',
                parentKey: 'c2',
                jsonPath: 'items[*].quantity',
                propName: 'quantity',
                dataType: 'number',
                hidden: true,
                className: 'hideRow',
              },
            ],
          },
          {
            key: 'c3',
            parentKey: 'k1',
            jsonPath: 'location',
            propName: 'location',
            dataType: 'number',
            hidden: true,
            className: 'hideRow',
          },
        ],
        childMatchFound: true,
      }];

      const state = reducer(initialState, actions.mapping.v2.patchExtractsFilter('$.inventoryassignment', '$.items'));
      const nextState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [],
          extractsTree: expectedTree,
        },
      };

      expect(state).toEqual(nextState);
    });
  });
  describe('MAPPING.V2.DELETE_ALL', () => {
    test('should keep v2 data empty if no v2TreeData is present in state', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              key: 'new_key',
              dataType: 'string',
              isEmptyRow: true,
              title: '',
            },
          ],
          extractsTree: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteAll());

      expect(state).toEqual(initialState);
    });
    test('should empty v2TreeData and make it as grouped output if its a csv or xlsx resource', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [
            {
              dataType: 'string',
              generate: 'id',
              extract: '$.id',
              children: [{
                dataType: 'string',
                generate: 'id',
                extract: '$.id',
              }],
            },
          ],
          extractsTree: [],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteAll(true));
      const newState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'new_key',
            title: '',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            children: [
              {
                key: 'new_key',
                title: '',
                dataType: MAPPING_DATA_TYPES.STRING,
                isEmptyRow: true,
              },
            ],
          }],
          extractsTree: [],
        },
      };

      expect(state).toEqual(newState);
    });
  });
  describe('MAPPING.V2.AUTO_CREATE_STRUCTURE', () => {
    test('should correctly update treeData based on sample data for non csv/xlsx with required mappings', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const importSampleData = {
        id: 12,
        name: 'test',
        allNames: ['a', 'b', 'c'],
        address: {},
        siblings: [{
          fname: 'Bob',
        }],
      };
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          requiredMappings: ['id', 'siblings[*].fname'],
          v2TreeData: [
            {
              dataType: 'string',
              generate: 'id',
              extract: '$.id',
              children: [{
                dataType: 'string',
                generate: 'id',
                extract: '$.id',
              }],
            },
          ],
          extractsTree: [],
        },
      };

      const state = reducer(initialState, actions.mapping.v2.autoCreateStructure(importSampleData, false));
      const newState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          requiredMappings: ['id', 'siblings[*].fname'],
          autoCreated: true,
          isGroupedOutput: false,
          v2TreeData: [
            {
              dataType: 'number',
              generate: 'id',
              isRequired: true,
              jsonPath: 'id',
              key: 'new_key',
              title: '',
            },
            {
              dataType: 'string',
              generate: 'name',
              isRequired: false,
              jsonPath: 'name',
              key: 'new_key',
              title: '',
            },
            {
              dataType: 'stringarray',
              generate: 'allNames',
              isRequired: false,
              jsonPath: 'allNames',
              key: 'new_key',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  isEmptyRow: true,
                  key: 'new_key',
                  title: '',
                  parentKey: 'new_key',
                },
              ],
              dataType: 'object',
              generate: 'address',
              isRequired: false,
              jsonPath: 'address',
              key: 'new_key',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  generate: 'fname',
                  isRequired: true,
                  jsonPath: 'siblings[*].fname',
                  key: 'new_key',
                  parentKey: 'new_key',
                  title: '',
                },
              ],
              dataType: 'objectarray',
              generate: 'siblings',
              isRequired: true,
              jsonPath: 'siblings',
              key: 'new_key',
              title: '',
            },
          ],
          extractsTree: [],
        },
      };

      expect(state).toEqual(newState);
    });
    test('should correctly update treeData based on sample data for csv/xlsx', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const importSampleData = {
        id: 12,
        name: 'test',
      };
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          requiredMappings: [],
          v2TreeData: [
            {
              dataType: 'string',
              generate: 'id',
              extract: '$.id',
              children: [{
                dataType: 'string',
                generate: 'id',
                extract: '$.id',
              }],
            },
          ],
          extractsTree: [],
        },
      };

      const state = reducer(initialState, actions.mapping.v2.autoCreateStructure(importSampleData, true));
      const newState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          requiredMappings: [],
          isGroupedOutput: true,
          autoCreated: true,
          v2TreeData: [{
            children: [
              {
                dataType: 'number',
                generate: 'id',
                isRequired: false,
                jsonPath: 'id',
                key: 'new_key',
                title: '',
              },
              {
                dataType: 'string',
                generate: 'name',
                isRequired: false,
                jsonPath: 'name',
                key: 'new_key',
                title: '',
              },
            ],
            dataType: 'objectarray',
            generateDisabled: true,
            key: 'new_key',
            title: '',
          }],
          extractsTree: [],
        },
      };

      expect(state).toEqual(newState);
    });
  });
  describe('MAPPING.V2.DELETE_NEW_ROW_KEY action', () => {
    test('delete the newRowKey from mappings', () => {
      const initialState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          newRowKey: 'key1',
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
        },
      };
      const state = reducer(initialState, actions.mapping.v2.deleteNewRowKey());
      const expectedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          v2TreeData: [{
            key: 'key1',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'fname',
            extract: '$.fname',
          }],
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
    const afterToggleVersion = reducer(afterAutoMapFailed, actions.mapping.toggleVersion(2));
    const afterToggleOutput = reducer(afterToggleVersion, actions.mapping.v2.toggleOutput('rows'));
    const afterToggleRows = reducer(afterToggleOutput, actions.mapping.v2.toggleRows(true));
    const afterExpandedKeys = reducer(afterToggleRows, actions.mapping.v2.updateExpandedKeys([]));
    const afterDeleteRow = reducer(afterExpandedKeys, actions.mapping.v2.deleteRow('some_key'));
    const afterAddRow = reducer(afterDeleteRow, actions.mapping.v2.addRow('some_key'));
    const afterUpdateDataType = reducer(afterAddRow, actions.mapping.v2.updateDataType('some_key', MAPPING_DATA_TYPES.STRING));
    const afterDragDrop = reducer(afterUpdateDataType, actions.mapping.v2.dropRow({}));
    const afterPatchField = reducer(afterDragDrop, actions.mapping.v2.patchField('generate', 'some_key', {}));
    const afterPatchSettings = reducer(afterPatchField, actions.mapping.v2.patchSettings('some_key', {}));
    const afterUpdateActiveKey = reducer(afterPatchSettings, actions.mapping.v2.updateActiveKey('some_key'));
    const afterChangeTab = reducer(afterUpdateActiveKey, actions.mapping.v2.changeArrayTab('some_key', 1, '$'));
    const afterAutoCreate = reducer(afterChangeTab, actions.mapping.v2.autoCreateStructure({}, true));
    const afterDeleteAll = reducer(afterAutoCreate, actions.mapping.v2.deleteAll(true));

    expect(afterDeleteAll).toEqual({});
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
    test('should return true if v1 mappings not changed but v2 changed', () => {
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
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          v2TreeDataCopy: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'new-name',
              extract: '$.fname',
            },
          ],
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
    test('should return false if v1,v2 mappings and lookups did not change', () => {
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
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          v2TreeDataCopy: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
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
  describe('selectors.v2MappingChanged', () => {
    test('should return false if state does not exist', () => {
      expect(selectors.v2MappingChanged()).toEqual(false);
      expect(selectors.v2MappingChanged(null)).toEqual(false);
      expect(selectors.v2MappingChanged({})).toEqual(false);
      expect(selectors.v2MappingChanged({mapping: {}})).toEqual(false);
    });
    test('should return false if v2 mappings not changed', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          v2TreeDataCopy: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
        },
      };

      expect(selectors.v2MappingChanged(state)).toEqual(false);
    });
    test('should return true if v2 mappings not changed', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
          importId: '123',
          flowId: '123',
          saveStatus: 'completed',
          v2TreeDataCopy: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'new-name',
              extract: '$.fname',
            },
          ],
          mappingsCopy: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
            {key: 'key2', generate: 'xyz2', extract: 'xyz'},
            {key: 'key3', generate: 'xyz3', extract: 'xyz'},
          ],
        },
      };

      expect(selectors.v2MappingChanged(state)).toEqual(true);
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
  describe('selectors.v2MappingsTreeData', () => {
    test('should return empty array if state does not exist', () => {
      expect(selectors.v2MappingsTreeData()).toEqual([]);
      expect(selectors.v2MappingsTreeData(null)).toEqual([]);
      expect(selectors.v2MappingsTreeData({})).toEqual([]);
      expect(selectors.v2MappingsTreeData({mapping: {}})).toEqual([]);
    });
    test('should return v2TreeData', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };

      expect(selectors.v2MappingsTreeData(state)).toEqual([
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
          extract: '$.fname',
        },
      ]);
    });
  });
  describe('selectors.mappingVersion', () => {
    test('should return undefined if state does not exist', () => {
      expect(selectors.mappingVersion()).toBeUndefined();
      expect(selectors.mappingVersion(null)).toBeUndefined();
      expect(selectors.mappingVersion({})).toBeUndefined();
      expect(selectors.mappingVersion({mapping: {}})).toBeUndefined();
    });
    test('should return mapping version', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          version: 2,
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };

      expect(selectors.mappingVersion(state)).toEqual(2);
    });
  });
  describe('selectors.v2MappingExpandedKeys', () => {
    test('should return empty array if state does not exist', () => {
      expect(selectors.v2MappingExpandedKeys()).toEqual([]);
      expect(selectors.v2MappingExpandedKeys(null)).toEqual([]);
      expect(selectors.v2MappingExpandedKeys({})).toEqual([]);
      expect(selectors.v2MappingExpandedKeys({mapping: {}})).toEqual([]);
    });
    test('should return expanded keys', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          version: 2,
          expandedKeys: ['key1'],
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };

      expect(selectors.v2MappingExpandedKeys(state)).toEqual(['key1']);
    });
  });
  describe('selectors.v2ActiveKey', () => {
    test('should return undefined if state does not exist', () => {
      expect(selectors.v2ActiveKey()).toBeUndefined();
      expect(selectors.v2ActiveKey(null)).toBeUndefined();
      expect(selectors.v2ActiveKey({})).toBeUndefined();
      expect(selectors.v2ActiveKey({mapping: {}})).toBeUndefined();
    });
    test('should return active key', () => {
      const state = {
        mapping: {
          mappings: [
            {key: 'key1', generate: 'xyz1', extract: 'xyz'},
          ],
          importId: '123',
          flowId: '123',
          version: 2,
          v2ActiveKey: 'key1',
          v2TreeData: [
            {
              key: 'key1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'fname',
              extract: '$.fname',
            },
          ],
        },
      };

      expect(selectors.v2ActiveKey(state)).toEqual('key1');
    });
  });
});

describe('mapping utils', () => {
  describe('expandRow util', () => {
    test('should do nothing if state or key does not exist', () => {
      expect(expandRow()).toBeUndefined();
      expect(expandRow(null, null)).toBeUndefined();
    });
    test('should add new key in the expandedKeys state if exists', () => {
      const state = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1', 'key2', 'key3'],
        },
      };
      const updatedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1', 'key2', 'key3', 'key4'],
        },
      };

      expandRow(state, 'key4');
      expect(state).toEqual(updatedState);
    });
    test('should create expandedKeys array with passed key if it does not exist', () => {
      const state = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
        },
      };
      const updatedState = {
        mapping: {
          importId: 'imp-123',
          flowId: 'flow-123',
          version: 2,
          expandedKeys: ['key1'],
        },
      };

      expandRow(state, 'key1');
      expect(state).toEqual(updatedState);
    });
  });
  describe('updateChildrenProps util', () => {
    test('should return original children if its falsy', () => {
      expect(updateChildrenProps()).toBeUndefined();
      expect(updateChildrenProps(null)).toBeNull();
      expect(updateChildrenProps([])).toEqual([]);
    });
    test('should update parent node reference props in the children and return new children array if data type is object array', () => {
      const children = [{
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        dataType: 'string',
      }];
      const parentNode = {
        key: 'key1',
        combinedExtract: '$.siblings[*]',
        generate: 'siblings',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
      };

      const newChildren = [
        {
          key: 'c1',
          extract: '$.fname',
          generate: 'fname',
          dataType: 'string',
          parentExtract: '$.siblings[*]',
          parentKey: 'key1',
          isEmptyRow: false,
        },
      ];

      expect(updateChildrenProps(children, parentNode, MAPPING_DATA_TYPES.OBJECTARRAY)).toEqual(newChildren);
    });
    test('should remove parent node reference props in the children and return new children array if data type is not object array', () => {
      const children = [{
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        dataType: 'string',
        parentExtract: '$.siblings[*]',
        parentKey: 'key1',
        isEmptyRow: false,
      },
      {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        dataType: 'string',
        parentExtract: '$.children[*]',
        parentKey: 'key1',
        isEmptyRow: false,
      }];
      const parentNode = {
        key: 'key1',
        combinedExtract: '$.siblings[*]',
        generate: 'siblings',
        dataType: MAPPING_DATA_TYPES.OBJECT,
      };

      const newChildren = [
        {
          key: 'c1',
          extract: '$.fname',
          generate: 'fname',
          dataType: 'string',
        },
      ];

      expect(updateChildrenProps(children, parentNode, MAPPING_DATA_TYPES.OBJECT)).toEqual(newChildren);
    });
  });
  describe('updateDataType util', () => {
    const state = {
      mapping: {
        importId: 'imp-123',
        flowId: 'flow-123',
        version: 2,
      },
    };

    test('should return original node if its falsy', () => {
      expect(updateDataType()).toBeUndefined();
      expect(updateDataType({}, null)).toBeNull();
    });
    test('should return original node if old and new data types are same', () => {
      const node = {
        key: 'key1',
        generate: 'fname',
        extract: '$.fname',
        dataType: MAPPING_DATA_TYPES.STRING,
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.STRING, MAPPING_DATA_TYPES.STRING)).toBe(node);
    });
    test('should remove children if new data type is object array with copy source as yes', () => {
      const node = {
        key: 'key1',
        generate: 'fname',
        extract: '$.fname',
        copySource: 'yes',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        children: [{}],
      };

      const newNode = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname',
        copySource: 'yes',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.OBJECT, MAPPING_DATA_TYPES.OBJECTARRAY)).toEqual(newNode);
    });
    test('should add empty row to children if new data type is object array with copy source as no and no existing children', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        key: 'key1',
        generate: 'fname',
        extract: '$.fname',
        dataType: MAPPING_DATA_TYPES.STRING,
      };

      const newNode = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'key1',
          parentExtract: '$.fname',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.STRING, MAPPING_DATA_TYPES.OBJECTARRAY)).toEqual(newNode);
    });
    test('should delete existing children if new data type is object with copy source as yes', () => {
      const node = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname[*]',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        copySource: 'yes',
        children: [{
          key: 'c1',
          extract: '$.child1',
          generate: 'child1',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      const newNode = {
        key: 'key1',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        copySource: 'yes',
        extract: '$.fname[*]',
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.OBJECT)).toEqual(newNode);
    });
    test('should delete existing children and add empty row to children if new data type is object with copy source as no', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname[*]',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        children: [{
          key: 'c1',
          extract: '$.child1',
          generate: 'child1',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      const newNode = {
        key: 'key1',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'key1',
          parentExtract: '',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.OBJECT)).toEqual(newNode);
    });
    test('should delete existing children if new data type is primitive array', () => {
      const node = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname[*]',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        children: [{
          key: 'c1',
          extract: '$.child1',
          generate: 'child1',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      const newNode = {
        key: 'key1',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.STRINGARRAY,
        combinedExtract: '$.fname[*]',
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.STRINGARRAY)).toEqual(newNode);
    });
    test('should delete existing children if new data type is primitive type', () => {
      const node = {
        key: 'key1',
        generate: 'fname',
        combinedExtract: '$.fname[*]',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        children: [{
          key: 'c1',
          extract: '$.child1',
          generate: 'child1',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };

      const newNode = {
        key: 'key1',
        extract: '$.fname[*]',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.NUMBER,
      };

      expect(updateDataType(state, node, MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.NUMBER)).toEqual(newNode);
    });
  });
});
