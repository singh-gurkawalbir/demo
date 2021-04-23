/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  dirty,
  requestBody,
  validate,
} = processorLogic;

describe('structuredFileGenerator processor logic', () => {
  describe('init util', () => {
    test('should correctly return rule and sample data from file definition data', () => {
      const options = {
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
      };

      const fileDefinitionData = {
        sampleData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
      };

      const expectedOutput = {
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      expect(init({options, fileDefinitionData})).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should return true if original data does not match new data', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta88","Syntax version number": "3"}}',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return true if original rule does not match new rule', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message new desc"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      expect(dirty(editor)).toEqual(true);
    });
    test('should return false if both data and rule has not changed', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      expect(dirty(editor)).toEqual(false);
    });
  });
  describe('requestBody util', () => {
    test('should return the correct data and rules object', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      const expectedBody = {
        rules: {
          name: 'DAF EDIFACT DESADV',
          description: 'Despatch advice message',
        },
        data: {
          'SYNTAX IDENTIFIER': {
            'Syntax identifier': 'UNOC_ashu123_gupta',
            'Syntax version number': '3',
          },
        },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should return data error if data is invalid json string', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      expect(validate(editor)).toEqual({dataError: 'Unexpected token } in JSON at position 95', ruleError: null});
    });
    test('should return rule error if rule is invalid json string', () => {
      const editor = {
        id: 'filefiledefinitionrules',
        editorType: 'structuredFileGenerator',
        fieldId: 'file.filedefinition.rules',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}}',
        originalRule: '{"name": "DAF EDIFACT DESADV","description": "Despatch advice message"}',
        data: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
        originalData: '{"SYNTAX IDENTIFIER": {"Syntax identifier": "UNOC_ashu123_gupta","Syntax version number": "3"}}',
      };

      expect(validate(editor)).toEqual({dataError: null, ruleError: 'Unexpected token } in JSON at position 71'});
    });
  });
});
