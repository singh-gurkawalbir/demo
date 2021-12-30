/* global describe, test, expect, beforeEach */

import processorLogic from './index';

const {
  init,
  patchSet,
} = processorLogic;

describe('responseTransform processor logic', () => {
  let resource;
  let editor;

  beforeEach(() => {
    resource = {
      _id: '99999',
      name: 'Mock http export',
      responseTransform: {
        type: 'expression',
        expression: {
          rules: [
            [{
              extract: 'id',
              generate: 'new-id',
            },
            {
              extract: 'name',
              generate: 'new-name',
            }],
          ],
        },
      },
    };
    editor = {
      id: 'tx-99999',
      stage: 'responseTransform',
      resourceId: '99999',
      resourceType: 'exports',
      data: {
        transform: '{"id": 123}',
        javascript: '{"record": {"id": 123}}',
      },
      rule: {
        transform: [{
          extract: 'id',
          generate: 'new-id',
        },
        {
          extract: 'name',
          generate: 'new-name',
        }],
        javascript: {
          fetchScriptContent: true,
          entryFunction: 'transform',
        },
      },
      originalRule: {
        transform: [{
          extract: 'id',
          generate: 'new-id',
        },
        {
          extract: 'name',
          generate: 'new-name',
        }],
        javascript: {
          fetchScriptContent: true,
          entryFunction: 'transform',
        },
      },
    };
  });

  describe('init util', () => {
    test('should correctly set the activeProcessor when the resource has a script added', () => {
      resource.responseTransform.type = 'script';
      resource.responseTransform.script = {
        _scriptId: '49595',
        function: 'transform',
      };
      delete resource.responseTransform.expression;

      const options = {
        stage: 'responseTransform',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'responseTransform',
        resourceId: '99999',
        resourceType: 'exports',
        rule: {
          javascript: {
            fetchScriptContent: true,
            scriptId: '49595',
            entryFunction: 'transform',
          },
        },
        activeProcessor: 'javascript',
      };

      expect(init({resource, options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule along with options', () => {
      const options = {
        stage: 'responseTransform',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'responseTransform',
        resourceId: '99999',
        resourceType: 'exports',
        rule: {
          transform: [{
            extract: 'id',
            generate: 'new-id',
          },
          {
            extract: 'name',
            generate: 'new-name',
          }],
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'transform',
          },
        },
        activeProcessor: 'transform',
      };

      expect(init({resource, options})).toEqual(expectedOutput);
    });
  });
  describe('patchSet util', () => {
    test('should add and return the backgroundPatches when a script is present', () => {
      editor.activeProcessor = 'javascript';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{
            op: 'replace',
            path: '/sampleResponseData',
            value: '{"id": 123}',
          },
          { op: 'replace',
            path: '/responseTransform',
            value: {
              type: 'script',
              expression: {
                version: 1,
                rules: [
                  [{
                    extract: 'id',
                    generate: 'new-id',
                  },
                  {
                    extract: 'name',
                    generate: 'new-name',
                  }],
                ],
              },
              script: {
                function: 'transform',
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
      editor.activeProcessor = 'transform';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{
            op: 'replace',
            path: '/sampleResponseData',
            value: '{"id": 123}',
          },
          { op: 'replace',
            path: '/responseTransform',
            value: {
              type: 'expression',
              expression: {
                version: 1,
                rules: [
                  [{
                    extract: 'id',
                    generate: 'new-id',
                  },
                  {
                    extract: 'name',
                    generate: 'new-name',
                  }],
                ],
              },
              script: {
                function: 'transform',
              },
            } }],
          resourceType: 'exports',
          resourceId: '99999',
        }],
        backgroundPatches: [],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
