
import { dataAsString, getFormSaveStatusFromCommStatus, getUniqueFieldId, getFormSaveStatusFromEditorStatus, resolveValue } from './index';

describe('editor utils test cases', () => {
  describe('dataAsString util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(dataAsString()).toBeUndefined();
    });
    test('should return the passed data if its of string type', () => {
      const data = '{"id": "45"}';

      expect(dataAsString(data)).toBe(data);
    });
    test('should return the stringified data if passed argument is not of string type', () => {
      const data = {id: '45'};
      const expectedString = JSON.stringify(data, null, 2);

      expect(dataAsString(data)).toEqual(expectedString);
      expect(dataAsString({})).toBe('{}');
    });
  });
  describe('getFormSaveStatusFromEditorStatus util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getFormSaveStatusFromEditorStatus()).toBe('failed');
    });
    test('should return complete if status is success', () => {
      expect(getFormSaveStatusFromEditorStatus('success')).toBe('complete');
    });
    test('should return loading if status is requested', () => {
      expect(getFormSaveStatusFromEditorStatus('requested')).toBe('loading');
    });
  });

  describe('getFormSaveStatusFromCommStatus util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getFormSaveStatusFromCommStatus()).toBe('complete');
    });
    test('should return complete if commStatus is success', () => {
      expect(getFormSaveStatusFromCommStatus('success')).toBe('complete');
    });
    test('should return loading if commStatus is loading', () => {
      expect(getFormSaveStatusFromCommStatus('loading')).toBe('loading');
    });
    test('should return failed if commStatus is error', () => {
      expect(getFormSaveStatusFromCommStatus('error')).toBe('failed');
    });
  });

  describe('getUniqueFieldId util', () => {
    test('should return empty string if no parameters are passed', () => {
      expect(getUniqueFieldId()).toBe('');
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

      expect(getUniqueFieldId('http.bodyCreate', resource1)).toBe('http.body');
      expect(getUniqueFieldId('http.bodyUpdate', resource2)).toBe('http.body.0');
    });
    test('should return rest field ids for old rest imports incase of http fields', () => {
      const resource1 = {
        _id: '123',
        adaptorType: 'RESTImport',
        ignoreExisting: true,
      };
      const resource2 = {
        _id: '123',
        adaptorType: 'RESTImport',
        ignoreExisting: false,
      };

      expect(getUniqueFieldId('http.relativeURICreate', resource1)).toBe('rest.relativeURI');
      expect(getUniqueFieldId('http.relativeURIUpdate', resource2)).toBe('rest.relativeURI.0');
      expect(getUniqueFieldId('http.bodyCreate', resource1)).toBe('rest.body');
      expect(getUniqueFieldId('http.bodyUpdate', resource2)).toBe('rest.body.0');
      expect(getUniqueFieldId('http.relativeURI', resource2)).toBe('rest.relativeURI');
      expect(getUniqueFieldId('http.once.relativeURI', resource2)).toBe('rest.once.relativeURI');
      expect(getUniqueFieldId('http.body', resource2)).toBe('rest.body');
    });

    test('should return http field ids for new rest exports incase of rest fields', () => {
      const resource = {
        _id: '123',
        adaptorType: 'HTTPExport',
      };

      expect(getUniqueFieldId('rest.relativeURI', resource)).toBe('http.relativeURI');
      expect(getUniqueFieldId('rest.postBody', resource)).toBe('http.body');
      expect(getUniqueFieldId('rest.once.postBody', resource)).toBe('http.once.body');
      expect(getUniqueFieldId('rest.pagingPostBody', resource)).toBe('http.paging.body');
      expect(getUniqueFieldId('rest.nextPageRelativeURI', resource)).toBe('http.paging.relativeURI');
    });

    test('should return unique fieldId', () => {
      expect(getUniqueFieldId('rdbms.queryInsert')).toBe('rdbms.query.1');
      expect(getUniqueFieldId('rdbms.queryUpdate')).toBe('rdbms.query.0');
      expect(getUniqueFieldId('http.bodyCreate')).toBe('http.body.1');
      expect(getUniqueFieldId('http.bodyUpdate')).toBe('http.body.0');
      expect(getUniqueFieldId('http.relativeURIUpdate')).toBe('http.relativeURI.0');
      expect(getUniqueFieldId('http.relativeURICreate')).toBe('http.relativeURI.1');
      expect(getUniqueFieldId('rdbms.query1')).toBe('rdbms.query');
      expect(getUniqueFieldId('rdbms.query2')).toBe('rdbms.query');
    });
    test('should correctly return field id in case of graphql field', () => {
      expect(getUniqueFieldId('graphql.query')).toBe('http.body');
      expect(getUniqueFieldId('graphql.variables', {}, {}, 'connections')).toBe('http.ping.body');
    });
  });

  describe('resolveValue util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(resolveValue()).toBeUndefined();
    });
    test('should call value with editorContext as a parameter if value is a function', () => {
      const value = editorContext => editorContext;
      const editorContext = {value: 123};

      expect(resolveValue(value, editorContext)).toEqual(editorContext);
      expect(resolveValue(value)).toBeUndefined();
    });

    test('should return value if value is not a function', () => {
      const value = 'helpKey';
      const editorContext = {value: 123};

      expect(resolveValue(value, editorContext)).toEqual(value);
      expect(resolveValue(value)).toEqual(value);
    });
  });
});

