/* global */

// import sizeof from 'object-sizeof';
import * as sizeof from 'object-sizeof';
import { getMockOutputFromResource, validateMockDataField, validateMockOutputField, validateMockResponseField } from '.';
import errorMessageStore from '../errorStore';

jest.mock('object-sizeof', () => ({
  __esModule: true,
  ...jest.requireActual('object-sizeof'),
  default: () => 1024,
}));

describe('flowdebugger -', () => {
  describe('validateMockOutputField util test cases', () => {
    afterEach(() => {
      sizeof.default = () => 1024;
    });
    test('should not throw exception for invalid arguments', () => {
      expect(validateMockOutputField()).toBeUndefined();
    });
    test('should return if mock output is empty string', () => {
      expect(validateMockOutputField('')).toBeUndefined();
    });
    test('should return correct error if mock output is invalid json', () => {
      expect(validateMockOutputField('a')).toEqual(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'));
    });
    test('should return correct error if mock output is larger than 1MB', () => {
      sizeof.default = () => 1024 * 1024 + 1;
      const mockOutput = {
        page_of_records: [{ record: {id: 123} }],
      };

      expect(validateMockOutputField(mockOutput)).toEqual(errorMessageStore('MOCK_OUTPUT_SIZE_EXCEED'));
    });
    test('should return correct error if mock output is invalid format', () => {
      expect(validateMockOutputField('{"page_of_records": { "record": "abc"}}')).toEqual(errorMessageStore('MOCK_OUTPUT_INVALID_FORMAT'));
    });
    test('should return error if mock output has more than 10 records', () => {
      const mockOutput = { page_of_records: Array.from({length: 11}, () => ({record: {id: '123'}})) };

      expect(validateMockOutputField(mockOutput)).toEqual(errorMessageStore('MOCK_OUTPUT_NUM_RECORDS_EXCEED'));
    });
    test('should not return error if mock output is correct', () => {
      const mockOutput = { page_of_records: Array.from({length: 10}, () => ({record: {id: '123'}})) };

      expect(validateMockOutputField(mockOutput)).toBeUndefined();
    });
    test('should not return error if mock output has length prop', () => {
      const mockOutput = {
        page_of_records: [
          {
            record: {
              id: '1',
              length: 13,
            },
          },
        ],
      };

      expect(validateMockOutputField(mockOutput)).toBeUndefined();
    });
  });
  describe('validateMockResponseField util test cases', () => {
    afterEach(() => {
      sizeof.default = () => 1024;
    });
    test('should not throw exception for invalid arguments', () => {
      expect(validateMockResponseField()).toBeUndefined();
    });
    test('should return if mock response is empty string', () => {
      expect(validateMockResponseField('')).toBeUndefined();
    });
    test('should return error if mock response is invalid json', () => {
      expect(validateMockResponseField('a')).toEqual(errorMessageStore('MOCK_RESPONSE_INVALID_JSON'));
    });
    test('should return error if mock response is larger than 1MB', () => {
      sizeof.default = () => 1024 * 1024 + 1;
      const mockRespnose = { _json: {id: 123 } };

      expect(validateMockResponseField(mockRespnose)).toEqual(errorMessageStore('MOCK_RESPONSE_SIZE_EXCEED'));
    });
    test('should return error if mock response is invalid canonical format', () => {
      const mockResponse = [{name: 'name'}];

      expect(validateMockResponseField(mockResponse)).toEqual(errorMessageStore('MOCK_RESPONSE_INVALID_FORMAT'));
    });
    test('should not return error if mock response is correct', () => {
      const mockResponse = [{id: 'name'}];

      expect(validateMockResponseField(mockResponse)).toBeUndefined();
    });
  });
  describe('validateMockDataField util test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(validateMockDataField()).toBeUndefined();
    });
    test('should validate mock output if resource type is exports', () => {
      expect(validateMockDataField('exports', 'value')).toEqual(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'));
    });
    test('should validate mock response if resource type is imports', () => {
      expect(validateMockDataField('imports', 'value')).toEqual(errorMessageStore('MOCK_RESPONSE_INVALID_JSON'));
    });
    test('should validate mock response if resource type is not passed', () => {
      expect(validateMockDataField(undefined, 'value')).toEqual(errorMessageStore('MOCK_RESPONSE_INVALID_JSON'));
    });
  });
  describe('getMockOutputFromResource util test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getMockOutputFromResource()).toBeUndefined();
    });
    test('should return if mock output is not on resource', () => {
      expect(getMockOutputFromResource({})).toBeUndefined();
    });
    test('should return error if mock output is invalid', () => {
      const resource = {mockOutput: { page_of_records: Array.from({length: 11}, () => ({record: {id: '123'}})) }};

      expect(getMockOutputFromResource(resource)).toBeUndefined();
    });
    test('should return first record of mock output', () => {
      const resource = {mockOutput: { page_of_records: Array.from({length: 10}, () => ({record: {id: '123'}})) }};

      expect(getMockOutputFromResource(resource)).toEqual({id: '123'});
    });
    test('should return record if mock output has only one record', () => {
      const resource = {mockOutput: { page_of_records: Array.from({length: 1}, () => ({record: {id: '123'}})) }};

      expect(getMockOutputFromResource(resource)).toEqual({id: '123'});
    });
    test('should return first row of mock output', () => {
      const resource = {mockOutput: { page_of_records: Array.from({length: 10}, () => ({rows: [{id: '123'}]})) }};

      expect(getMockOutputFromResource(resource)).toEqual([{id: '123'}]);
    });
  });
});
