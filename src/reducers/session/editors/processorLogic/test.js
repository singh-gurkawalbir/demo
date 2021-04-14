/* global describe, test, expect */

import processorLogic, { getLogic } from './index';
import handlebars from './handlebars';
import exportFilter from './exportFilter';
import transform from './transform';

const {requestOptions,
  validate,
  isDirty,
  init,
  processResult,
  buildData,
  preSaveValidate} = processorLogic;

describe('processorLogic index utils', () => {
  describe('getLogic util', () => {
    test('should throw error if editor type is not supported', () => {
      expect(() => {
        getLogic({});
      }).toThrowError('Type [undefined] not supported.');

      expect(() => {
        getLogic({editorType: 'dummy'});
      }).toThrowError('Type [dummy] not supported.');
    });
    test('should return the processor logic object and not throw error if editor type is supported', () => {
      expect(getLogic({editorType: 'handlebars'})).toBeTruthy();
    });
  });
  describe('validate util', () => {
    test('should return undefined if editor does not exist', () => {
      expect(validate()).toBeUndefined();
    });
    test('should return false if there are no data or rule violations', () => {
      const editor = {
        editorType: 'handlebars',
        formKey: 'new-123',
        data: '{"name": "Bob"}',
      };

      expect(validate(editor)).toEqual(false);
    });
    test('should return the data and rule violations if exist', () => {
      const editor = {
        editorType: 'filter',
        stage: 'exportFilter',
        isInvalid: true,
      };

      const violations = {
        dataError: 'Unexpected token u in JSON at position 0',
        ruleError: 'Invalid rule',
      };

      expect(validate(editor)).toEqual(violations);
    });
  });
  describe('requestOptions util', () => {
    test('should return undefined if editor does not exist', () => {
      expect(requestOptions()).toBeUndefined();
    });
    test('should return violations and skipPreview if either is truthy', () => {
      const editor1 = {
        editorType: 'handlebars',
        formKey: 'new-123',
      };
      const editor2 = {
        editorType: 'settingsForm',
        rule: {json: {}},
      };

      expect(requestOptions(editor1)).toEqual({violations: {dataError: 'Must provide some sample data.'}});
      expect(requestOptions(editor2)).toEqual({violations: false, skipPreview: true});
    });
    test('should return the correct processor', () => {
      const editor1 = {
        editorType: 'settingsForm',
        rule: {script: {entryFunction: 'main', code: 'some code'}},
      };
      const editor2 = {
        editorType: 'flowTransform',
        activeProcessor: 'transform',
        data: {transform: '{"name": "Bob"}'},
      };

      expect(requestOptions(editor1)).toHaveProperty('processor', 'javascript');
      expect(requestOptions(editor2)).toHaveProperty('processor', 'transform');
    });
  });
  describe('isDirty util', () => {
    test('should return undefined if editor does not exist', () => {
      expect(isDirty()).toBeUndefined();
    });
    test('should call and return processor dirty logic if present', () => {
      const editor = {
        editorType: 'javascript',
        rule: {
          _init_code: 'old code',
          code: 'new code',
        },
      };

      expect(isDirty(editor)).toEqual(true);
    });
    test('should compare original and new rule from editor if processor logic does not exist', () => {
      const editor = {
        editorType: 'handlebars',
        rule: '{{id}}',
        originalRule: '{{name}}',
      };

      expect(isDirty(editor)).toEqual(true);
    });
  });
  describe('init util', () => {
    test('should return undefined if editor type is undefined', () => {
      expect(init()).toBeUndefined();
    });
    test('should return the processor init function if exists', () => {
      expect(init('handlebars')).toEqual(handlebars.init);
      expect(init('filter')).toBeUndefined();
    });
  });
  describe('buildData util', () => {
    test('should return undefined if editor type is undefined', () => {
      expect(buildData()).toBeUndefined();
    });
    test('should return the processor buildData function if exists', () => {
      expect(buildData('exportFilter')).toEqual(exportFilter.buildData);
      expect(buildData('handlebars')).toBeUndefined();
    });
  });
  describe('processResult util', () => {
    test('should return undefined if editor is undefined', () => {
      expect(processResult()).toBeUndefined();
    });
    test('should return the processor processResult function if exists', () => {
      expect(processResult({editorType: 'exportFilter'})).toEqual(exportFilter.processResult);
      expect(processResult({editorType: 'csvGenerator'})).toBeUndefined();
    });
  });
  describe('preSaveValidate util', () => {
    test('should return undefined if editor is undefined', () => {
      expect(preSaveValidate()).toBeUndefined();
    });
    test('should return the processor preSaveValidate function if exists', () => {
      expect(preSaveValidate({editorType: 'transform'})).toEqual(transform.preSaveValidate);
      expect(preSaveValidate({editorType: 'handlebars'})).toBeUndefined();
    });
  });
});
