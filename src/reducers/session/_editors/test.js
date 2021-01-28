/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('editors reducers', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toBe(oldState);
  });

  describe('UPDATE_HELPER_FUNCTIONS action', () => {
    test('should add the helper functions in the state', () => {
      const helperFunctions = {
        abs: '{{abs field}}',
      };
      const newState = reducer(
        undefined,
        actions._editor.updateHelperFunctions(helperFunctions)
      );
      const expectedState = {
        helperFunctions: {
          abs: '{{abs field}}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const helperFunctions = {
        abs: '{{abs field}}',
      };
      const initialState = {
        httpbody: { id: 'httpbody', editorType: 'handlebars' },
        query: { id: 'query', editorType: 'sql' },
      };
      const newState = reducer(
        initialState,
        actions._editor.updateHelperFunctions(helperFunctions)
      );

      expect(newState).toHaveProperty('httpbody', { id: 'httpbody', editorType: 'handlebars' });
      expect(newState).toHaveProperty('query', { id: 'query', editorType: 'sql' });
    });
  });
  describe('INIT_COMPLETE action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', {})
      );

      expect(state).toEqual({httpbody: {}});
    });
    test('should not throw error in case of invalid arguments', () => {
      const state = reducer(
        undefined,
        actions._editor.initComplete()
      );

      expect(state).toEqual({});
    });
    test('should create the editor state with passed options', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
        },
      };

      expect(state).toEqual(newState);
    });
    test('should not affect sibling entries', () => {
      const initialState = {
        query: {id: 'query'},
      };
      const newState = reducer(
        initialState,
        actions._editor.initComplete('httpbody', {})
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('CHANGE_LAYOUT action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.changeLayout('httpbody', 'compact')
      );

      expect(state).toEqual({});
    });
    test('should update the editor state with provided layout', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.changeLayout('httpbody', 'column')
      );

      expect(newState).toHaveProperty('httpbody.layout', 'column');
    });
    test('should not alter sibling editor states', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.changeLayout('httpbody', 'compact')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('CLEAR action', () => {
    test('should clear the editor reference from the state', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.clear('httpbody')
      );

      expect(newState).not.toHaveProperty('httpbody');
    });
    test('should not alter any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.clear('httpbody')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('SAMPLEDATA.RECEIVED action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.sampleDataReceived('httpbody', 'data')
      );

      expect(state).toEqual({});
    });
    test('should not call processor logic if buildData does not exist and store the passed sample data to the state directly', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}', 2)
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          data: '{"id": "123"}',
          dataVersion: 2,
          sampleDataStatus: 'received',
          lastValidData: '{"id": "123"}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should store the sample data returned by processor logic buildData function, if exists', () => {
      const options = {
        id: 'efilter-123',
        editorType: 'exportFilter',
        stage: 'exportFilter',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('efilter-123', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.sampleDataReceived('efilter-123', '{"rows": [{"id": "123"}]}')
      );
      const expectedState = {
        'efilter-123': {
          id: 'efilter-123',
          editorType: 'exportFilter',
          stage: 'exportFilter',
          data: {
            filter: '{"rows": [{"id": "123"}]}',
            javascript: JSON.stringify({record: [{id: '123'}]}, null, 2),
          },
          sampleDataStatus: 'received',
          lastValidData: '{"rows": [{"id": "123"}]}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should store the defaultData along with data if editorType is sql', () => {
      const options = {
        id: 'query',
        editorType: 'sql',
        stage: 'flowInput',
        supportsDefaultData: true,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('query', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.sampleDataReceived('query', '{"rows": [{"id": "123"}]}')
      );
      const expectedState = {
        query: {
          id: 'query',
          editorType: 'sql',
          stage: 'flowInput',
          supportsDefaultData: true,
          data: '{"rows": [{"id": "123"}]}',
          defaultData: JSON.stringify({row: {id: {default: ''}}}, null, 2),
          sampleDataStatus: 'received',
          lastValidData: '{"rows": [{"id": "123"}]}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify sibling state entries', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.sampleDataReceived('query', '{"rows": [{"id": "123"}]}')
      );

      expect(newState).toHaveProperty('httpbody', {id: 'httpbody'});
    });
  });
  describe('SAMPLEDATA.FAILED action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.sampleDataFailed('httpbody', 'some error')
      );

      expect(state).toEqual({});
    });
    test('should update the sample data status and store error msg', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.sampleDataFailed('httpbody', 'some error')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          sampleDataStatus: 'error',
          initError: 'some error',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.sampleDataFailed('httpbody', 'some error')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('TOGGLE_VERSION action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.toggleVersion('httpbody', 2)
      );

      expect(state).toEqual({});
    });
    test('should update the state with v2 rule if passed version is 2', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        v2Rule: '{{v2}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}', 1)
      );
      const newState = reducer(
        tempState,
        actions._editor.toggleVersion('httpbody', 2)
      );

      expect(newState).toHaveProperty('httpbody.rule', '{{v2}}');
    });
    test('should update the state with v1 rule if passed version is 1', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        v1Rule: '{{v1}}',
        v2Rule: '{{v2}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.toggleVersion('httpbody', 1)
      );

      expect(newState).toHaveProperty('httpbody.rule', '{{v1}}');
    });
    test('should update state correctly with dataVersion prop matching the passed version', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        v2Rule: '{{v2}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.toggleVersion('httpbody', 1)
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          data: '{"id": "123"}',
          sampleDataStatus: 'requested',
          lastValidData: '{"id": "123"}',
          v2Rule: '{{v2}}',
          dataVersion: 1,
          result: '',
          rule: '',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter sibling state entries', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.toggleVersion('query', 2)
      );

      expect(newState).toHaveProperty('httpbody', {id: 'httpbody'});
    });
  });
  describe('TOGGLE_AUTO_PREVIEW action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.toggleAutoPreview('httpbody', false)
      );

      expect(state).toEqual({});
    });
    test('should toggle the current flag state if no argument is passed', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        autoEvaluate: true,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.toggleAutoPreview('httpbody')
      );

      expect(newState).toHaveProperty('httpbody.autoEvaluate', false);
    });
    test('should set the autoEvaluate flag to the passed argument', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        autoEvaluate: false,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.toggleAutoPreview('httpbody', false)
      );

      expect(newState).toHaveProperty('httpbody.autoEvaluate', false);
    });
    test('should reset the previewStatus flag if autoEvaluate is true', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        autoEvaluate: false,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.toggleAutoPreview('httpbody', true)
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          autoEvaluate: true,
          previewStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter sibling state entries', () => {
      const initialState = {
        query: {id: 'query', autoEvaluate: true},
        httpbody: {id: 'httpbody', autoEvaluate: false},
      };
      const newState = reducer(
        initialState,
        actions._editor.toggleAutoPreview('query', false)
      );

      expect(newState).toHaveProperty('httpbody', {id: 'httpbody', autoEvaluate: false});
    });
  });
  describe('PATCH.RULE action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.patchRule('httpbody', {})
      );

      expect(state).toEqual({});
    });
    test('should replace the editor rule if its not of object type', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{abs oldField}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchRule('httpbody', '{{abs newField}}')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          data: '{"id": "123"}',
          sampleDataStatus: 'received',
          lastValidData: '{"id": "123"}',
          lastChange: expect.any(Number),
          rule: '{{abs newField}}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add the props in the rule if rule patch is of object type', () => {
      const options = {
        id: 'file.csv',
        editorType: 'csvParser',
        stage: 'flowInput',
        rule: {
          columnDelimiter: '\n',
          rowDelimiter: '-',
        },
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('file.csv', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('file.csv', 'name\tage-Bob\t30')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchRule('file.csv', {columnDelimiter: '\t', wrapInQuotes: true})
      );
      const expectedState = {
        'file.csv': {
          id: 'file.csv',
          editorType: 'csvParser',
          stage: 'flowInput',
          data: 'name\tage-Bob\t30',
          sampleDataStatus: 'received',
          lastValidData: 'name\tage-Bob\t30',
          lastChange: expect.any(Number),
          rule: {
            columnDelimiter: '\t',
            rowDelimiter: '-',
            wrapInQuotes: true,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should only replace the active processor rule if editor is of dual mode type', () => {
      const options = {
        id: 'efilter',
        editorType: 'exportFilter',
        stage: 'exportFilter',
        rule: {
          filter: ['is', 'a', 'b'],
          javascript: {fetchScriptContent: true},
        },
        activeProcessor: 'filter',

      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('efilter', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('efilter', '{"id": "abc"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchRule('efilter', ['is', 'id', 'id'])
      );
      const expectedState = {
        efilter: {
          id: 'efilter',
          editorType: 'exportFilter',
          stage: 'exportFilter',
          activeProcessor: 'filter',
          data: {
            filter: '{"id": "abc"}',
            javascript: JSON.stringify({id: 'abc'}, null, 2),
          },
          sampleDataStatus: 'received',
          lastValidData: '{"id": "abc"}',
          lastChange: expect.any(Number),
          rule: {
            filter: ['is', 'id', 'id'],
            javascript: {fetchScriptContent: true},
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should replace v1/v2 rule if dataVersion is available in the state', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        v2Rule: '{{v2 rule}}',
        v1Rule: '{{abs oldField}}',
        rule: '{{abs oldField}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}', 2)
      );
      const newState = reducer(
        tempState,
        actions._editor.patchRule('httpbody', '{{abs newField}}')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          data: '{"id": "123"}',
          sampleDataStatus: 'received',
          lastValidData: '{"id": "123"}',
          lastChange: expect.any(Number),
          dataVersion: 2,
          v2Rule: '{{abs newField}}',
          v1Rule: '{{abs oldField}}',
          rule: '{{abs newField}}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should reset previewStatus if autoEvaluate is true', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        autoEvaluate: true,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchRule('httpbody', '{{abs newField}}')
      );

      expect(newState).toHaveProperty('httpbody.previewStatus', 'requested');
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.patchRule('httpbody', '{{abs newField}}')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('PATCH.DATA action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.patchData('httpbody', '{}')
      );

      expect(state).toEqual({});
    });
    test('should update the editor data with the passed patched data', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchData('httpbody', '{"id": "456"}')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          data: '{"id": "456"}',
          sampleDataStatus: 'received',
          lastValidData: '{"id": "456"}',
          lastChange: expect.any(Number),
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should only replace the active processor data if editor is of dual mode type', () => {
      const options = {
        id: 'efilter',
        editorType: 'exportFilter',
        stage: 'exportFilter',
        activeProcessor: 'filter',

      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('efilter', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('efilter', '{"id": "abc"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchData('efilter', '{"id": "abc", "name": "Bob"}')
      );
      const expectedState = {
        efilter: {
          id: 'efilter',
          editorType: 'exportFilter',
          stage: 'exportFilter',
          activeProcessor: 'filter',
          data: {
            filter: '{"id": "abc", "name": "Bob"}',
            javascript: JSON.stringify({id: 'abc'}, null, 2),
          },
          sampleDataStatus: 'received',
          lastValidData: {
            filter: '{"id": "abc", "name": "Bob"}',
            javascript: JSON.stringify({id: 'abc'}, null, 2),
          },
          lastChange: expect.any(Number),
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should reset previewStatus if autoEvaluate is true', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        autoEvaluate: true,
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('httpbody', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchData('httpbody', '{"id": "456"}')
      );

      expect(newState).toHaveProperty('httpbody.previewStatus', 'requested');
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.patchData('httpbody', '{"id": "123"}')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('PATCH.FEATURES action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.patchFeatures('httpbody', {layout: 'compact'})
      );

      expect(state).toEqual({});
    });
    test('should patch passed props in the editor state', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.patchFeatures('httpbody', {layout: 'column'})
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          layout: 'column',
          lastChange: expect.any(Number),
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should toggle form data and update layout if editor type is settingsForm and patch contains activeProcessor', () => {
      const options = {
        id: 'settings',
        editorType: 'settingsForm',
        stage: 'flowInput',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('settings', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('settings', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchFeatures('settings', {activeProcessor: 'json'})
      );
      const expectedState = {
        settings: {
          id: 'settings',
          editorType: 'settingsForm',
          stage: 'flowInput',
          data: JSON.stringify({id: '123'}, null, 2),
          sampleDataStatus: 'received',
          layout: 'jsonFormBuilder',
          lastValidData: '{"id": "123"}',
          lastChange: expect.any(Number),
          activeProcessor: 'json',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should delete formOutput from state if editor type is settingsForm and patch contains data changes', () => {
      const options = {
        id: 'settings',
        editorType: 'settingsForm',
        stage: 'flowInput',
        formOutput: {id: 123},
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('settings', options)
      );
      const tempState = reducer(
        initialState,
        actions._editor.sampleDataReceived('settings', '{"id": "123"}')
      );
      const newState = reducer(
        tempState,
        actions._editor.patchFeatures('settings', {data: '{"id": "456"}'})
      );

      expect(newState).not.toHaveProperty('settings.formOutput');
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.patchFeatures('httpbody', {layout: 'compact'})
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('PREVIEW.RESPONSE action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.previewResponse('httpbody', 'some result')
      );

      expect(state).toEqual({});
    });
    test('should correctly update state with preview status as received', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.id}}',
        error: 'error',
        errorLine: 24,
        violations: 'violations',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.previewResponse('httpbody', '123')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.id}}',
          previewStatus: 'received',
          result: '123',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.previewResponse('httpbody', 'some result')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('VALIDATE_FAILURE action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.validateFailure('httpbody', 'invalid data')
      );

      expect(state).toEqual({});
    });
    test('should correctly update state with preview status as error', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.id}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.validateFailure('httpbody', 'invalid data')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.id}}',
          previewStatus: 'error',
          violations: 'invalid data',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.validateFailure('httpbody', 'invalid data')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('PREVIEW.FAILED action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.previewFailed('httpbody', {errorMessage: 'some error', errorLine: 12})
      );

      expect(state).toEqual({});
    });
    test('should correctly update state with preview status as error and errorLine', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.id}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.previewFailed('httpbody', {errorMessage: 'some error', errorLine: 12})
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.id}}',
          previewStatus: 'error',
          error: 'some error',
          errorLine: 12,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.previewFailed('httpbody', {errorMessage: 'some error', errorLine: 12})
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('SAVE.REQUEST action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.saveRequest('httpbody')
      );

      expect(state).toEqual({});
    });
    test('should correctly update state with save status as requested', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.id}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.saveRequest('httpbody')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.id}}',
          saveStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.saveRequest('httpbody')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('SAVE.FAILED action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.saveFailed('httpbody', 'save error msg')
      );

      expect(state).toEqual({});
    });
    test('should correctly update state with save status as failed and error message', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.id}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.saveFailed('httpbody', 'save error msg')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.id}}',
          saveStatus: 'failed',
          saveMessage: 'save error msg',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.saveFailed('httpbody', 'save error msg')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
  describe('SAVE.COMPLETE action', () => {
    test('should not throw error if state does not exist', () => {
      const state = reducer(
        undefined,
        actions._editor.saveComplete('httpbody')
      );

      expect(state).toEqual({});
    });
    test('should update save status and reset original rule', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{data.name}}',
        originalRule: '{{data.id}}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.saveComplete('httpbody')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: '{{data.name}}',
          saveStatus: 'success',
          originalRule: '{{data.name}}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should update save status and reset original data only if its already present', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: {rowSuffix: '\n'},
        originalRule: {rowSuffix: '-'},
        data: '{"id": 123, "name": "Angel"}',
        originalData: '{"id": 123, "name": "Bob"}',
      };
      const initialState = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const newState = reducer(
        initialState,
        actions._editor.saveComplete('httpbody')
      );
      const expectedState = {
        httpbody: {
          id: 'httpbody',
          editorType: 'handlebars',
          stage: 'flowInput',
          rule: {rowSuffix: '\n'},
          saveStatus: 'success',
          originalRule: {rowSuffix: '\n'},
          data: '{"id": 123, "name": "Angel"}',
          originalData: '{"id": 123, "name": "Angel"}',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not modify any other editor state', () => {
      const initialState = {
        query: {id: 'query'},
        httpbody: {id: 'httpbody'},
      };
      const newState = reducer(
        initialState,
        actions._editor.saveComplete('httpbody')
      );

      expect(newState).toHaveProperty('query', {id: 'query'});
    });
  });
});

describe('editors selectors', () => {
  const editorId = 'httpbody';

  describe('_editor', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors._editor(undefined, editorId)).toEqual({});
      expect(selectors._editor({}, editorId)).toEqual({});
      expect(selectors._editor({123: {}}, editorId)).toEqual({});
    });
    test('should return correct editor state when a match is found', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedState = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
      };

      expect(selectors._editor(state, editorId)).toEqual(expectedState);
    });
  });
  describe('_editorData', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors._editorData(undefined, editorId)).toBeUndefined();
      expect(selectors._editorData({}, editorId)).toBeUndefined();
      expect(selectors._editorData({123: {}}, editorId)).toBeUndefined();
    });
    test('should return the active processor data if present', () => {
      const options = {
        id: 'efilter',
        editorType: 'exportFilter',
        stage: 'exportFilter',
        activeProcessor: 'filter',
        data: {
          filter: '{"rows": [{"id": "123"}]}',
          javascript: JSON.stringify({record: [{id: '123'}]}, null, 2),
        },
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedData = '{"rows": [{"id": "123"}]}';

      expect(selectors._editorData(state, editorId)).toEqual(expectedData);
    });
    test('should correctly return state data', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        data: '{"id": 123}',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedData = '{"id": 123}';

      expect(selectors._editorData(state, editorId)).toEqual(expectedData);
    });
  });
  describe('_editorResult', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors._editorResult(undefined, editorId)).toEqual({});
      expect(selectors._editorResult({}, editorId)).toEqual({});
      expect(selectors._editorResult({123: {}}, editorId)).toEqual({});
    });
    test('should return correct editor state when a match is found', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        result: '123',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedResult = '123';

      expect(selectors._editorResult(state, editorId)).toEqual(expectedResult);
    });
  });
  describe('_editorRule', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors._editorRule(undefined, editorId)).toEqual({});
      expect(selectors._editorRule({}, editorId)).toEqual({});
      expect(selectors._editorRule({123: {}}, editorId)).toEqual({});
    });
    test('should return the active processor rule if present', () => {
      const options = {
        id: 'efilter',
        editorType: 'exportFilter',
        stage: 'exportFilter',
        activeProcessor: 'filter',
        rule: {
          filter: ['is', 'a', 'b'],
          javascript: {fetchScriptContent: true},
        },
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedRule = ['is', 'a', 'b'];

      expect(selectors._editorRule(state, editorId)).toEqual(expectedRule);
    });
    test('should correctly return state rule', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        data: '{"id": 123}',
        rule: '{{id}}',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedRule = '{{id}}';

      expect(selectors._editorRule(state, editorId)).toEqual(expectedRule);
    });
  });
  describe('_editorPreviewError', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors._editorPreviewError(undefined, editorId)).toEqual({});
      expect(selectors._editorPreviewError({}, editorId)).toEqual({});
      expect(selectors._editorPreviewError({123: {}}, editorId)).toEqual({});
    });
    test('should return object with error and errorLine when a match is found', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        data: '{"id": 123}',
        rule: '{{id}}',
        error: 'some error',
        errorLine: 34,
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );
      const expectedOutput = {
        error: 'some error',
        errorLine: 34,
      };

      expect(selectors._editorPreviewError(state, editorId)).toEqual(expectedOutput);
    });
  });
  describe('_editorDataVersion', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors._editorDataVersion(undefined, editorId)).toBeUndefined();
      expect(selectors._editorDataVersion({}, editorId)).toBeUndefined();
      expect(selectors._editorDataVersion({123: {}}, editorId)).toBeUndefined();
    });
    test('should return the data version if found in state', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        data: '{"id": 123}',
        rule: '{{id}}',
        v2Rule: '{{id}}',
        dataVersion: 2,
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );

      expect(selectors._editorDataVersion(state, editorId)).toEqual(2);
    });
  });
  describe('_editorLayout', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors._editorLayout(undefined, editorId)).toBeUndefined();
      expect(selectors._editorLayout({}, editorId)).toBeUndefined();
      expect(selectors._editorLayout({123: {}}, editorId)).toBeUndefined();
    });
    test('should return the data version if found in state', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        data: '{"id": 123}',
        rule: '{{id}}',
        v2Rule: '{{id}}',
        dataVersion: 2,
        layout: 'compact',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );

      expect(selectors._editorLayout(state, editorId)).toEqual('compact');
    });
  });
  describe('_editorViolations', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors._editorViolations(undefined, editorId)).toBeUndefined();
      expect(selectors._editorViolations({}, editorId)).toBeUndefined();
      expect(selectors._editorViolations({123: {}}, editorId)).toBeUndefined();
    });
    test('should call and return the corresponding processor logic validate function result', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{id}}',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );

      expect(selectors._editorViolations(state, editorId)).toEqual({dataError: 'Must provide some sample data.'});
    });
  });
  describe('_isEditorDirty', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors._isEditorDirty(undefined, editorId)).toBeUndefined();
      expect(selectors._isEditorDirty({}, editorId)).toBeUndefined();
      expect(selectors._isEditorDirty({123: {}}, editorId)).toBeUndefined();
    });
    test('should call and return the corresponding processor logic dirty function result', () => {
      const options = {
        id: 'httpbody',
        editorType: 'handlebars',
        stage: 'flowInput',
        rule: '{{id}}',
        originalRule: '{{name}}',
      };
      const state = reducer(
        undefined,
        actions._editor.initComplete('httpbody', options)
      );

      expect(selectors._isEditorDirty(state, editorId)).toEqual(true);
    });
  });
});
