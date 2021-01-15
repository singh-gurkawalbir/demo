/* global describe, test, expect */
import { getUniqueFieldId } from './index';

describe('tests for util getUniqueFieldId', () => {
  test('should return empty string if no parameters are passed', () => {
    expect(getUniqueFieldId()).toEqual('');
  });

  test('should return uniq fieldId', () => {
    expect(getUniqueFieldId('rdbms.queryInsert')).toEqual('rdbms.query.1');
    expect(getUniqueFieldId('rdbms.queryUpdate')).toEqual('rdbms.query.0');
    expect(getUniqueFieldId('http.bodyCreate')).toEqual('http.body.1');
    expect(getUniqueFieldId('http.bodyUpdate')).toEqual('http.body.0');
    expect(getUniqueFieldId('http.relativeURIUpdate')).toEqual('http.relativeURI.0');
    expect(getUniqueFieldId('http.relativeURICreate')).toEqual('http.relativeURI.1');
    expect(getUniqueFieldId('rest.relativeURIUpdate')).toEqual('rest.relativeURI.0');
    expect(getUniqueFieldId('rest.relativeURICreate')).toEqual('rest.relativeURI.1');
    expect(getUniqueFieldId('rest.bodyUpdate')).toEqual('rest.body.0');
    expect(getUniqueFieldId('rest.bodyCreate')).toEqual('rest.body.1');
  });
});
