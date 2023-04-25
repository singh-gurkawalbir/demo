
import processorLogic from './index';

const {
  init,
  patchSet,
} = processorLogic;

describe('inputFilter processor logic', () => {
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
    test('should correctly set the activeProcessor when the resource has a script added and resourceType is imports', () => {
      resource.filter.type = 'script';
      resource.filter.script = {
        _scriptId: '49595',
        function: 'filter',
      };
      delete resource.filter.expression;

      const options = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'imports',
      };
      const expectedOutput = {
        stage: 'exportFilter',
        resourceId: '99999',
        resourceType: 'imports',
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
    test('should correctly return the rule along with options when resourceType is exports', () => {
      resource.inputFilter = {
        type: 'expression',
        expression: {
          rules: ['equals', ['string', ['extract', 'id']], '876'],
        },
      };
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
          filter: ['equals', ['string', ['extract', 'id']], '876'],
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
  });
  describe('patchSet util', () => {
    test('should add and return the backgroundPatches when a script is present and also set correct path based on resource type', () => {
      editor.activeProcessor = 'javascript';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{ op: 'replace',
            path: '/inputFilter',
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
      editor.resourceType = 'imports';
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
          resourceType: 'imports',
          resourceId: '99999',
        }],
        backgroundPatches: [
          {
            action: {
              eventId: 'IMPORT_HAS_CONFIGURED_INCOMING_FILTER',
              type: 'ANALYTICS_GAINSIGHT_TRACK_EVENT',
            },
          },
        ],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
