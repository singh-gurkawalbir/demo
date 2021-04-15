/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  dirty,
  requestBody,
  validate,
} = processorLogic;

describe('structuredFileParser processor logic', () => {
  describe('init util', () => {
    test('should correctly return rule and sample data from file definition data', () => {
      const options = {
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
      };

      const fileDefinitionData = {
        sampleData: 'ISA|SA|850|1234',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
      };

      const expectedOutput = {
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1234',
      };

      expect(init({options, fileDefinitionData})).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should return true if original data does not match new data', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1239989',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return true if original rule does not match new rule', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message new desc"}',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1234',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return false if both data and rule has not changed', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1234',
      };

      expect(dirty(editor)).toEqual(false);
    });
  });
  describe('requestBody util', () => {
    test('should return the correct data and rules object', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1234',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
      };

      const expectedBody = {
        rules: {
          name: 'DAF EDIFACT DESADV',
          description: 'Despatch advice message',
        },
        data: 'ISA|SA|850|1234',
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should return data error if data is invalid', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
      };

      expect(validate(editor)).toEqual({dataError: 'Must provide some sample data.', ruleError: null});
    });
    test('should return rule error if rule is invalid json string', () => {
      const editor = {
        id: 'filefileDefinition',
        editorType: 'structuredFileParser',
        fieldId: 'file.fileDefinition',
        formKey: 'new-123',
        stage: 'flowInput',
        data: 'ISA|SA|850|1234',
        originalData: 'ISA|SA|850|1234',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}}',
      };

      expect(validate(editor)).toEqual({dataError: false, ruleError: 'Unexpected token } in JSON at position 71'});
    });
  });
});
