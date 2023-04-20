
import processorLogic from './index';

const {
  requestBody,
  validate,
  dirty,
  patchSet,
  processResult,
} = processorLogic;

describe('javascript processor logic', () => {
  let editor;

  beforeEach(() => {
    editor = {
      id: 'js-99999',
      stage: 'script',
      resourceId: '99999',
      resourceType: 'exports',
      data: '{"id": 123}',
      rule: {
        entryFunction: 'someFunc',
        fetchScriptContent: true,
        code: 'some code',
        _init_code: 'some code',
        scriptId: '123',
      },
      originalRule: {
        entryFunction: 'someFunc',
        fetchScriptContent: true,
        scriptId: '123',
      },
    };
  });

  describe('requestBody util', () => {
    test('should correctly return the body if editor data is of string type', () => {
      const expectedBody = {
        rules: {
          function: 'someFunc',
          code: 'some code',
          _scriptId: '123',
        },
        data: {id: 123},
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should correctly return the request body if editor data if of object type', () => {
      editor.data = {
        name: 'Bob',
      };
      const expectedBody = {
        rules: {
          function: 'someFunc',
          code: 'some code',
          _scriptId: '123',
        },
        data: {name: 'Bob'},
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should correctly return dataError when data is invalid', () => {
      delete editor.data;
      const expectedOutput = {
        dataError: 'Must provide some sample data.',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly return script when script is not present', () => {
      delete editor.rule.scriptId;
      const expectedOutput = {
        ruleError: 'Script is required',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly return script when entry fucntion is not present', () => {
      delete editor.rule.entryFunction;
      const expectedOutput = {
        ruleError: 'Function is required',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should return true if original code is different from new code', () => {
      editor.rule.code = 'new code';
      expect(dirty(editor)).toBe(true);
    });
    test('should return true if original rule is different from new rule', () => {
      editor.rule.entryFunction = 'new function';
      expect(dirty(editor)).toBe(true);
    });
    test('should return false if no changes to rule has been made', () => {
      expect(dirty(editor)).toBe(false);
    });
  });
  describe('processResult util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(processResult()).toEqual({ data: '', logs: undefined });
    });
    test('should return correct data', () => {
      expect(processResult({}, {data: 'data'})).toEqual({ data: 'data', logs: undefined });
      expect(processResult({}, {data: {id: '123'}})).toEqual({ data: {id: '123'}, logs: undefined });
      expect(processResult({}, {data: false})).toEqual({ data: 'false', logs: undefined });
      expect(processResult({}, {data: true})).toEqual({ data: true, logs: undefined });
    });
    test('should return correct logs', () => {
      expect(processResult({}, {logs: 'logs'})).toEqual({ data: '', logs: 'logs' });
    });
  });
  describe('patchSet util', () => {
    test('should return the backgroundPatches containing /content path', () => {
      const editor = {
        id: 'script-123',
        stage: 'hook',
        flowId: 'flow-123',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: {
          code: 'some content',
          scriptId: '3388383',
        },
      };
      const expectedPatches = {
        backgroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: 'some content',
            },
          ],
          resourceType: 'scripts',
          resourceId: '3388383',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
