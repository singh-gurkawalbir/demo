/* global describe, test, expect */

import processorLogic, { extractForm, toggleData, generatePatchPath } from './index';

const {
  skipPreview,
  init,
  requestBody,
  dirty,
  validate,
  processResult,
  patchSet,
} = processorLogic;

describe('settingsForm processor logic', () => {
  describe('extractForm util', () => {
    test('should return undefined if data is invalid json', () => {
      const data = '{"id": 123}}';

      expect(extractForm(data)).toBeUndefined();
    });
    test('should return json data if mode is json', () => {
      const data = '{ "fieldMap": {}, "layout": { "fields": [] } }';
      const jsonData = { fieldMap: {}, layout: { fields: [] } };

      expect(extractForm(data, 'json')).toEqual(jsonData);
    });
    test('should return form data if data contains settingsForm object and mode is not json', () => {
      const data = {
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
      const formData = { fieldMap: {}, layout: { fields: [] } };

      expect(extractForm(data, 'script')).toEqual(formData);
    });
  });
  describe('toggleData util', () => {
    test('should return original data if its a string type and not a valid json', () => {
      const data = '{"id": 123}}';

      expect(toggleData(data)).toBe(data);
    });
    test('should return the stringified form meta when the mode is json and data contains settingsForm', () => {
      const data = {
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
      const formData = JSON.stringify({ fieldMap: {}, layout: { fields: [] } }, null, 2);

      expect(toggleData(data, 'json')).toEqual(formData);
    });
    test('should return the stringified complete resource when mode is not json and data does not contain settingsForm', () => {
      const data = { fieldMap: {}, layout: { fields: [] } };
      const formData = JSON.stringify({
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      }, null, 2);

      expect(toggleData(data, 'script')).toEqual(formData);
    });
  });
  describe('generatePatchPath util', () => {
    test('should return the passed path if section is general or undefined or all sections are empty', () => {
      expect(generatePatchPath(undefined, [], '/settings')).toEqual('/settings');
      expect(generatePatchPath('general', [], '/settings')).toEqual('/settings');
      expect(generatePatchPath('groupA', undefined, '/settings')).toEqual('/settings');
    });
    test('should return the correct index path when section is not general by excluding general section', () => {
      const allSections = [
        {sectionId: 'general'},
        {sectionId: 'groupA'},
        {sectionId: 'groupB'},
      ];

      expect(generatePatchPath('groupA', allSections, '/settings')).toEqual('/flowGroupings/0/settings');
      expect(generatePatchPath('groupB', allSections, '/settingsForm')).toEqual('/flowGroupings/1/settingsForm');
    });
  });
  describe('skipPreview util', () => {
    test('should return true if code or entry function is undefined', () => {
      const editor = {
        id: 'settings',
        fieldId: 'settings',
        stage: 'flowInput',
        rule: {
          script: {
            code: 'some code',
            entryFunction: 'main',
          },
        },
      };

      delete editor.rule.script.code;

      expect(skipPreview(editor)).toEqual(true);
      editor.rule.script.code = 'some code';
      delete editor.rule.script.entryFunction;
      expect(skipPreview(editor)).toEqual(true);
    });
    test('should return false if both code and entry function exists in editor rule', () => {
      const editor = {
        id: 'settings',
        fieldId: 'settings',
        stage: 'flowInput',
        rule: {
          script: {
            code: 'some code',
            entryFunction: 'main',
          },
        },
      };

      expect(skipPreview(editor)).toEqual(false);
    });
  });
  describe('init util', () => {
    test('should correctly return data and activeProcessor when resource does not contain script', () => {
      const options = {
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const settingsForm = {
        form: { fieldMap: {}, layout: { fields: [] } },
        init: {},
      };
      const expectedOutput = {
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: { fieldMap: {}, layout: { fields: [] } },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        insertStubKey: 'formInit',
        originalData: { fieldMap: {}, layout: { fields: [] } },
        settingsFormPatchPath: '/settingsForm',
      };

      expect(init({options, settingsForm})).toEqual(expectedOutput);
    });
    test('should correctly return data and activeProcessor when resource contains a script', () => {
      const options = {
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const settingsForm = {
        form: { fieldMap: {}, layout: { fields: [] } },
        init: {
          _scriptId: '123456',
          function: 'newFunc',
        },
      };
      const parsedData = {
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
      const expectedOutput = {
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'script',
        data: JSON.stringify(parsedData, null, 2),
        rule: {
          script: {
            entryFunction: 'newFunc',
            fetchScriptContent: true,
            scriptId: '123456',
          },
        },
        insertStubKey: 'formInit',
        originalData: JSON.stringify(parsedData, null, 2),
        settingsFormPatchPath: '/settingsForm',
      };

      expect(init({options, settingsForm})).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should return the wrapped data when active processor is json', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: { fieldMap: {}, layout: { fields: [] } },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalData: { fieldMap: {}, layout: { fields: [] } },
      };
      const expectedBody = {
        rules: {
          function: 'main',
        },
        data: {
          resource: {
            settingsForm: {
              form: { fieldMap: {}, layout: { fields: [] } },
            },
          },
          parentResource: {},
          license: {},
          parentLicense: {},
          sandbox: false,
        },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should use the editor data and return the body when active processor is not json', () => {
      const parsedData = {
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'script',
        data: JSON.stringify(parsedData, null, 2),
        rule: {
          script: {
            entryFunction: 'newFunc',
            fetchScriptContent: true,
            scriptId: '123456',
            code: 'some code content',
          },
        },
        originalData: JSON.stringify(parsedData, null, 2),
      };
      const expectedBody = {
        rules: {
          function: 'newFunc',
          code: 'some code content',
        },
        data: {
          resource: {
            settingsForm: {
              form: { fieldMap: {}, layout: { fields: [] } },
            },
          },
          parentResource: {},
          license: {},
          parentLicense: {},
          sandbox: false,
        },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('dirty util', () => {
    test('should return false if data is undefined or invalid', () => {
      expect(dirty({})).toEqual(false);
      expect(dirty({data: '{"id": 123}}'})).toEqual(false);
    });
    test('should return true if original data is different than new data', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: { fieldMap: {}, layout: { fields: ['field1'] } },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        insertStubKey: 'formInit',
        originalData: { fieldMap: {}, layout: { fields: [] } },
        scriptPatchPath: '/content',
        settingsFormPatchPath: '/settingsForm',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return true if original rule is different than new rule', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'script',
        data: { fieldMap: {}, layout: { fields: [] } },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
            scriptId: '12345',
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        insertStubKey: 'formInit',
        originalData: { fieldMap: {}, layout: { fields: [] } },
        scriptPatchPath: '/content',
        settingsFormPatchPath: '/settingsForm',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return false if nothing changed in the editor', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: { fieldMap: {}, layout: { fields: [] } },
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalRule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        insertStubKey: 'formInit',
        originalData: { fieldMap: {}, layout: { fields: [] } },
        scriptPatchPath: '/content',
        settingsFormPatchPath: '/settingsForm',
      };

      expect(dirty(editor)).toEqual(false);
    });
  });
  describe('validate util', () => {
    test('should correctly return dataError when data is invalid', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: '{{"fieldMap": {}, "layout": {"fields": [] } }',
      };
      const expectedOutput = {
        dataError: 'Unexpected token { in JSON at position 1',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should not return dataError when data is valid', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: '{"fieldMap": {}, "layout": {"fields": [] } }',
      };

      expect(validate(editor)).toEqual({dataError: false});
    });
  });
  describe('processResult util', () => {
    test('should use the editor data and inject settings value if the passed result is undefined', () => {
      const editor = {
        id: 'settings',
        settings: { store: 'lifestyle', open: ''},
        activeProcessor: 'json',
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name',
              type: 'text',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
            },
          },
        },
      };
      const expectedOutput = {
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name',
              type: 'text',
              defaultValue: 'lifestyle',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
              defaultValue: '',
            },
          },
        },
      };

      expect(processResult(editor)).toEqual(expectedOutput);
    });
    test('should not throw error if settings is undefined or field map is not of object type', () => {
      const editor = {
        id: 'settings',
        activeProcessor: 'json',
        data: {
          fieldMap: 'some string',
        },
      };
      const expectedOutput = {
        data: {
          fieldMap: 'some string',
        },
      };

      expect(processResult(editor)).toEqual(expectedOutput);
    });
    test('should not reset default value if field already contains a default and settings do not have the key', () => {
      const editor = {
        id: 'settings',
        settings: { open: ''},
        activeProcessor: 'json',
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name',
              type: 'text',
              defaultValue: 'some default store',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
            },
          },
        },
      };
      const expectedOutput = {
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name',
              type: 'text',
              defaultValue: 'some default store',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
              defaultValue: '',
            },
          },
        },
      };

      expect(processResult(editor)).toEqual(expectedOutput);
    });
    test('should throw error if a field inside fieldMap is not of object type', () => {
      const editor = {
        id: 'settings',
        settings: { open: ''},
        activeProcessor: 'json',
        data: {
          fieldMap: {
            store: 'some dummy field',
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
            },
          },
        },
      };

      expect(() => {
        processResult(editor);
      }).toThrowError('Invalid fieldMap. Key should be of object type');
    });
    test('should use the new result meta and inject default value in the field map fields', () => {
      const editor = {
        id: 'settings',
        settings: { store: 'lifestyle', open: ''},
        activeProcessor: 'script',
        data: {
          resource: {
            settingsForm: {
              form: {
                fieldMap: {
                  store: {
                    id: 'store',
                    name: 'store',
                    label: 'Store name',
                    type: 'text',
                  },
                  open: {
                    id: 'open',
                    name: 'open',
                    label: 'Is open?',
                    type: 'checkbox',
                  },
                },
              },
            },
          },
          parentResource: {},
          license: {},
          parentLicense: {},
          sandbox: false,
        },
      };
      const newResult = {
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name after the preview',
              type: 'text',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
            },
          },
        },
        logs: ['dummy logs'],
        duration: 44,
        mediaType: 'json',
      };
      const expectedOutput = {
        data: {
          fieldMap: {
            store: {
              id: 'store',
              name: 'store',
              label: 'Store name after the preview',
              type: 'text',
              defaultValue: 'lifestyle',
            },
            open: {
              id: 'open',
              name: 'open',
              label: 'Is open?',
              type: 'checkbox',
              defaultValue: '',
            },
          },
        },
        logs: ['dummy logs'],
      };

      expect(processResult(editor, newResult)).toEqual(expectedOutput);
    });
  });
  describe('patchSet util', () => {
    test('should add and return script patch only if rule contains script id', () => {
      const parsedData = {
        resource: {
          settingsForm: {
            form: { fieldMap: {}, layout: { fields: [] } },
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'script',
        data: JSON.stringify(parsedData, null, 2),
        rule: {
          script: {
            entryFunction: 'newFunc',
            fetchScriptContent: true,
            scriptId: '123456',
            code: 'some code content',
          },
        },
        originalData: JSON.stringify(parsedData, null, 2),
        insertStubKey: 'formInit',
        scriptPatchPath: '/content',
        settingsFormPatchPath: '/settingsForm',
      };
      const expectedPatches = {
        foregroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: 'some code content',
            },
          ],
          resourceType: 'scripts',
          resourceId: '123456',
        },
        {
          patch: [
            {
              op: 'replace',
              path: '/settingsForm',
              value: {
                form: { fieldMap: {}, layout: { fields: [] } },
                init: {
                  function: 'newFunc',
                  _scriptId: '123456',
                },
              },
            },
          ],
          resourceType: 'imports',
          resourceId: 'res-123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
    test('should not contain script patch and only return settings form patch when rule does not have script', () => {
      const editor = {
        id: 'settings',
        editorType: 'settingsForm',
        fieldId: 'settings',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        activeProcessor: 'json',
        data: JSON.stringify({ fieldMap: {}, layout: { fields: [] } }, null, 2),
        rule: {
          script: {
            entryFunction: 'main',
            fetchScriptContent: true,
          },
        },
        originalData: JSON.stringify({ fieldMap: {}, layout: { fields: [] } }, null, 2),
        insertStubKey: 'formInit',
        scriptPatchPath: '/content',
        settingsFormPatchPath: '/settingsForm',
      };
      const expectedPatches = {
        foregroundPatches: [
          {
            patch: [
              {
                op: 'replace',
                path: '/settingsForm',
                value: {
                  form: { fieldMap: {}, layout: { fields: [] } },
                },
              },
            ],
            resourceType: 'imports',
            resourceId: 'res-123',
          }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});
