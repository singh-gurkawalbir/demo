/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  patchSet,
} = processorLogic;

describe('postResponseMapHook processor logic', () => {
  describe('init util', () => {
    test('should not throw error if flow does not have hook present', () => {
      const flow = {
        _id: 'flow-123',
        name: 'some dummy flow',
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '363833992',
          },
        ],
      };

      const options = {
        stage: 'postResponseMapHook',
        resourceId: '363833992',
        resourceType: 'imports',
        resourceIndex: 0,
      };
      const expectedOutput = {
        stage: 'postResponseMapHook',
        resourceId: '363833992',
        resourceType: 'imports',
        resourceIndex: 0,
        rule: {
          entryFunction: 'postResponseMap',
          fetchScriptContent: true,
        },
        pageProcessorsObject: {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '363833992',
        },
      };

      expect(init({flow, options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule along with options', () => {
      const flow = {
        _id: 'flow-123',
        name: 'some dummy flow',
        pageProcessors: [
          {
            hooks: {
              postResponseMap: {
                _scriptId: '5f10418cc3a9e456c9cce121',
                function: 'dummyFunction',
              },
            },
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'export',
            _exportId: 'exp-123',
          },
        ],
      };

      const options = {
        stage: 'postResponseMapHook',
        resourceId: 'exp-123',
        resourceType: 'exports',
        resourceIndex: 0,
      };
      const expectedOutput = {
        stage: 'postResponseMapHook',
        resourceId: 'exp-123',
        resourceType: 'exports',
        resourceIndex: 0,
        rule: {
          entryFunction: 'dummyFunction',
          fetchScriptContent: true,
          scriptId: '5f10418cc3a9e456c9cce121',
        },
        pageProcessorsObject: {
          hooks: {
            postResponseMap: {
              _scriptId: '5f10418cc3a9e456c9cce121',
              function: 'dummyFunction',
            },
          },
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'export',
          _exportId: 'exp-123',
        },
      };

      expect(init({flow, options})).toEqual(expectedOutput);
    });
  });
  describe('patchSet util', () => {
    test('should add empty foreground hook patch if hook is not set', () => {
      const editor = {
        stage: 'postResponseMapHook',
        resourceId: '363833992',
        resourceType: 'imports',
        flowId: 'flow-123',
        resourceIndex: 0,
        rule: {
          entryFunction: 'postResponseMap',
          fetchScriptContent: true,
        },
        pageProcessorsObject: {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '363833992',
        },
      };
      const foregroundPatchSet = [{
        op: 'add',
        path: '/pageProcessors/0/hooks',
        value: {},
      },
      {
        op: 'add',
        path: '/pageProcessors/0/hooks/postResponseMap',
        value: {},
      },
      ];
      const expectedPatches = {
        foregroundPatches: [{
          patch: foregroundPatchSet,
          resourceType: 'flows',
          resourceId: 'flow-123',
        }],
        backgroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: undefined,
            },
          ],
          resourceType: 'scripts',
          resourceId: undefined,
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
    test('should reset hooks patch to undefined if none is set for script id', () => {
      const editor = {
        stage: 'postResponseMapHook',
        resourceId: '363833992',
        resourceType: 'imports',
        flowId: 'flow-123',
        resourceIndex: 0,
        rule: {
          entryFunction: 'postResponseMap',
          fetchScriptContent: true,
          scriptId: '',
        },
        pageProcessorsObject: {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '363833992',
        },
      };
      const foregroundPatchSet = [{
        op: 'add',
        path: '/pageProcessors/0/hooks',
        value: {},
      },
      {
        op: 'replace',
        path: '/pageProcessors/0/hooks',
        value: undefined,
      },
      ];
      const expectedPatches = {
        foregroundPatches: [{
          patch: foregroundPatchSet,
          resourceType: 'flows',
          resourceId: 'flow-123',
        }],
        backgroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: undefined,
            },
          ],
          resourceType: 'scripts',
          resourceId: '',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
    test('should correctly add the foreground hook patch set when hook is added', () => {
      const editor = {
        stage: 'postResponseMapHook',
        resourceId: 'exp-123',
        resourceType: 'exports',
        flowId: 'flow-123',
        resourceIndex: 0,
        rule: {
          entryFunction: 'dummyFunction',
          fetchScriptContent: true,
          scriptId: '5f10418cc3a9e456c9cce121',
          code: 'some code',
        },
        pageProcessorsObject: {
          hooks: {
            postResponseMap: {
              _scriptId: '5f10418cc3a9e456c9cce121',
              function: 'dummyFunction',
            },
          },
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'export',
          _exportId: 'exp-123',
        },
      };
      const foregroundPatchSet = [
        {
          op: 'replace',
          path: '/pageProcessors/0/hooks/postResponseMap',
          value: {
            _scriptId: '5f10418cc3a9e456c9cce121',
            function: 'dummyFunction',
          },
        },
      ];
      const expectedPatches = {
        foregroundPatches: [{
          patch: foregroundPatchSet,
          resourceType: 'flows',
          resourceId: 'flow-123',
        }],
        backgroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: 'some code',
            },
          ],
          resourceType: 'scripts',
          resourceId: '5f10418cc3a9e456c9cce121',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
