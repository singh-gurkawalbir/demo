
import processorLogic from './index';

const {
  init,
  buildData,
  requestBody,
  validate,
  dirty,
  processResult,
  preSaveValidate,
  patchSet,
} = processorLogic;

describe('flowTransform processor logic', () => {
  let resource;
  let editor;

  beforeEach(() => {
    resource = {
      _id: '99999',
      name: 'Mock http export',
      transform: {
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
      stage: 'flowTransform',
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
      resource.transform.type = 'script';
      resource.transform.script = {
        _scriptId: '49595',
        function: 'transform',
      };
      delete resource.transform.expression;

      const options = {
        stage: 'flowTransform',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'flowTransform',
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
        stage: 'flowTransform',
        resourceId: '99999',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'flowTransform',
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
  describe('buildData util', () => {
    test('should correctly return the transform and javascript sample data object', () => {
      const sampleData = '{"record": {"id": 123}}';
      const expectedOutput = {
        transform: JSON.stringify({id: 123}, null, 2),
        javascript: sampleData,
      };

      expect(buildData(undefined, sampleData)).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should correctly call the transform request body util if active processor is transform type', () => {
      editor.activeProcessor = 'transform';
      const expectedOutput = {
        rules: { version: '1',
          rules: [[{
            extract: 'id',
            generate: 'new-id',
          },
          {
            extract: 'name',
            generate: 'new-name',
          }]] },
        data: [{id: 123}],
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
    test('should correctly call the javascript request body util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';
      const expectedOutput = {
        rules: {
          function: 'transform',
        },
        data: {record: {id: 123}},
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
  });
  describe('validate util', () => {
    test('should correctly call the transform validate util if active processor is transform type', () => {
      editor.activeProcessor = 'transform';
      const expectedOutput = {
        dataError: null,
        ruleError: false,
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly call the javascript validate util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';
      editor.rule.javascript.scriptId = 'scriptId';
      const expectedOutput = {
        dataError: false,
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should correctly call the transform dirty util if active processor is transform type', () => {
      editor.activeProcessor = 'transform';

      expect(dirty(editor)).toBe(false);
    });
    test('should correctly call the javascript dirty util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';

      expect(dirty(editor)).toBe(false);
    });
  });
  describe('processResult util', () => {
    test('should correctly call the transform processResult util if active processor is transform type', () => {
      editor.activeProcessor = 'transform';

      expect(processResult(editor, {data: [{id: 123}]})).toEqual({data: {id: 123}});
    });
    test('should correctly call the javascript processResult util if active processor is script type', () => {
      editor.activeProcessor = 'javascript';

      expect(processResult(editor, {data: []})).toEqual({data: []});
    });
  });
  describe('preSaveValidate util', () => {
    test('should correctly call the transform preSaveValidate util if active processor is transform type', () => {
      editor.activeProcessor = 'transform';
      expect(preSaveValidate(editor)).toEqual({saveError: false});
    });
    test('should return save error as false if active processor is script type', () => {
      editor.activeProcessor = 'javascript';
      expect(preSaveValidate(editor)).toEqual({saveError: false});
    });
  });
  describe('patchSet util', () => {
    test('should add and return the backgroundPatches when a script is present', () => {
      editor.activeProcessor = 'javascript';
      const expectedPatches = {
        foregroundPatches: [{
          patch: [{ op: 'replace',
            path: '/transform',
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
          patch: [{ op: 'replace',
            path: '/transform',
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
