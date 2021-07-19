/* global describe, test, expect */
import { dataAsString, getFormSaveStatusFromCommStatus, getUniqueFieldId, getEditorStatus } from './index';

describe('editor utils test cases', () => {
  describe('dataAsString util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(dataAsString()).toEqual(undefined);
    });
    test('should return the passed data if its of string type', () => {
      const data = '{"id": "45"}';

      expect(dataAsString(data)).toBe(data);
    });
    test('should return the stringified data if passed argument is not of string type', () => {
      const data = {id: '45'};
      const expectedString = JSON.stringify(data, null, 2);

      expect(dataAsString(data)).toEqual(expectedString);
      expect(dataAsString({})).toEqual('{}');
    });
  });
  describe('getEditorStatus util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getEditorStatus()).toEqual('failed');
    });
    test('should return complete if status is success', () => {
      expect(getEditorStatus('success')).toEqual('complete');
    });
    test('should return loading if status is requested', () => {
      expect(getEditorStatus('requested')).toEqual('loading');
    });
  });

  describe('getFormSaveStatusFromCommStatus util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getFormSaveStatusFromCommStatus()).toEqual('failed');
    });
    test('should return complete if commStatus is success', () => {
      expect(getFormSaveStatusFromCommStatus('success')).toEqual('complete');
    });
    test('should return loading if commStatus is loading', () => {
      expect(getFormSaveStatusFromCommStatus('loading')).toEqual('loading');
    });
    test('should return failed if commStatus is error', () => {
      expect(getFormSaveStatusFromCommStatus('error')).toEqual('failed');
    });
  });

  describe('getUniqueFieldId util', () => {
    test('should return empty string if no parameters are passed', () => {
      expect(getUniqueFieldId()).toEqual('');
    });
    test('should correctly return field id in case ignoreExisting/ignoreMissing is set on the resource', () => {
      const resource1 = {
        _id: '123',
        adaptorType: 'HTTPImport',
        ignoreExisting: true,
      };
      const resource2 = {
        _id: '123',
        adaptorType: 'HTTPImport',
        ignoreExisting: false,
      };

      expect(getUniqueFieldId('http.bodyCreate', resource1)).toEqual('http.body');
      expect(getUniqueFieldId('http.bodyUpdate', resource2)).toEqual('http.body.0');
    });
    test('should return unique fieldId', () => {
      expect(getUniqueFieldId('rdbms.queryInsert')).toEqual('rdbms.query.1');
      expect(getUniqueFieldId('rdbms.queryUpdate')).toEqual('rdbms.query.0');
      expect(getUniqueFieldId('http.bodyCreate')).toEqual('http.body.1');
      expect(getUniqueFieldId('http.bodyUpdate')).toEqual('http.body.0');
      expect(getUniqueFieldId('http.relativeURIUpdate')).toEqual('http.relativeURI.0');
      expect(getUniqueFieldId('http.relativeURICreate')).toEqual('http.relativeURI.1');
    });
  });
});

