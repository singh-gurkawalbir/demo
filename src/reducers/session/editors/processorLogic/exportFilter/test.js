
import processorLogic from './index';

const {
  init,
  buildData,
  requestBody,
  validate,
  dirty,
  processResult,
  patchSet,
} = processorLogic;

describe('exportFilter processor logic', () => {
  let resource;
  let editor;

  beforeEach(() => {
    resource = {
      _id: '99999',
      name: 'Mock http export',
      filter: {
        type: 'expression',
        expression: {
          rules: ['equals', ['string', ['extract', 'id']], '456'],
        },

      },
    };
    editor = {
      id: 'eFilter',
      stage: 'exportFilter',
      resourceId: '99999',
      resourceType: 'exports',
      data: {
        filter: '{"record": {"id": 123}}',
        javascript: '{"record": {"id": 123}}',
      },
      rule: {
        filter: ['equals', ['string', ['extract', 'id']], '456'],
        javascript: {
          fetchScriptContent: true,
          entryFunction: 'filter',
        },
      },
      originalRule: {
        filter: ['equals', ['string', ['extract', 'id']], '000'],
        javascript: {
          fetchScriptContent: true,
          entryFunction: 'filter',
        },
      },
    };
  });

  describe('init util', () => {
    test('should correctly set the activeProcessor when the resource has a script added', () => {
      resource.filter.type = 'script';
      resource.filter.script = {
        _scriptId: '49595',
        function: 'filter',
      };
      delete resource.filter.expression;

      const options = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
        rule: {
          filter: [],
          javascript: {
            fetchScriptContent: true,
            scriptId: '49595',
            entryFunction: 'filter',
          },
        },
        activeProcessor: 'javascript',
        skipEmptyRuleCleanup: true,
      };

      expect(init({resource, options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule along with options', () => {
      const options = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
        rule: {
          filter: ['equals', ['string', ['extract', 'id']], '456'],
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'filter',
          },
        },
        activeProcessor: 'filter',
        skipEmptyRuleCleanup: true,
      };

      expect(init({resource, options})).toEqual(expectedOutput);
    });
    test('should correctly set the script context', () => {
      const options = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const scriptContext = {
        container: 'integration',
        type: 'hook',
        _flowId: 'abc',
        _integrationId: 'def',
      };
      const expectedOutput = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'exports',
        rule: {
          filter: ['equals', ['string', ['extract', 'id']], '456'],
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'filter',
          },
        },
        activeProcessor: 'filter',
        skipEmptyRuleCleanup: true,
        context: scriptContext,
      };

      expect(init({resource, options, scriptContext})).toEqual(expectedOutput);
    });
  });
  describe('buildData util', () => {
    test('should update rows to record for javascript data if sample data contains rows', () => {
      const sampleData = '{"rows": [{"id": 123}, {"id": 123}]}';
      const expectedOutput = {
        filter: sampleData,
        javascript: JSON.stringify({record: [{id: 123}, {id: 123}]}, null, 2),
      };

      expect(buildData(undefined, sampleData)).toEqual(expectedOutput);
    });
    test('should correctly return the filter and javascript sample data object', () => {
      const sampleData = '{"record": {"id": 123}}';
      const expectedOutput = {
        filter: sampleData,
        javascript: JSON.stringify({record: {id: 123}}, null, 2),
      };

      expect(buildData(undefined, sampleData)).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should correctly call the filter request body util if active processor is filter type', () => {
      editor.activeProcessor = 'filter';
      const expectedOutput = {
        rules: { version: '1', rules: ['equals', ['string', ['extract', 'id']], '456'] },
        data: [{id: 123}],
        options: { contextData: {} },
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
    test('should correctly call the javascript request body util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';
      const expectedOutput = {
        rules: {
          function: 'filter',
        },
        data: {record: {id: 123}},
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
  });
  describe('validate util', () => {
    test('should correctly call the filter validate util if active processor is filter type', () => {
      editor.activeProcessor = 'filter';
      const expectedOutput = {
        dataError: null,
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly call the javascript validate util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';
      const expectedOutput = {
        dataError: false,
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should correctly call the javascript dirty util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';

      expect(dirty(editor)).toBe(false);
    });
    test('should compare original rule and new rule for the filter if active processor is of filter type', () => {
      editor.activeProcessor = 'filter';

      expect(dirty(editor)).toBe(true);
    });
  });
  describe('processResult util', () => {
    test('should correctly call the filter processResult util if active processor is filter type', () => {
      editor.activeProcessor = 'filter';

      expect(processResult(editor, {data: []})).toEqual({data: 'FALSE: record will be ignored/discarded'});
    });
    test('should correctly call the javascript processResult util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';

      expect(processResult(editor, {data: []})).toEqual({data: []});
    });
  });
  describe('patchSet util', () => {
    test('should add and return the backgroundPatches when a script is present', () => {
      editor.activeProcessor = 'javascript';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{ op: 'replace',
            path: '/filter',
            value: {
              type: 'script',
              expression: {
                version: 1,
                rules: ['equals', ['string', ['extract', 'id']], '456'],
              },
              script: {
                function: 'filter',
              },
            } }],
          resourceType: 'exports',
          resourceId: '99999',
        }],
        backgroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
            },
          ],
          resourceType: 'scripts',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
    test('should not return the backgroundPatches for /content when no script is present', () => {
      editor.activeProcessor = 'filter';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{ op: 'replace',
            path: '/filter',
            value: {
              type: 'expression',
              expression: {
                version: 1,
                rules: ['equals', ['string', ['extract', 'id']], '456'],
              },
              script: {
                function: 'filter',
              },
            } }],
          resourceType: 'exports',
          resourceId: '99999',
        }],
        backgroundPatches: [
          {
            action: {
              eventId: 'EXPORT_HAS_CONFIGURED_FILTER',
              type: 'ANALYTICS_GAINSIGHT_TRACK_EVENT',
            },
          },
        ],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
