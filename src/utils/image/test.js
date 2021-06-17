/* global describe, test, expect */
import getImageUrl from './index';

describe('image utils test cases', () => {
  describe('getImageUrl util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getImageUrl()).toEqual('');
      expect(getImageUrl(null)).toEqual('');
      expect(getImageUrl({})).toEqual('');
    });
    test('should return the passed url if its an absolute path', () => {
      expect(getImageUrl('https://someurl.net/logo.png')).toEqual('https://someurl.net/logo.png');
    });
    test('should prepend cdn base uri to passed url', () => {
      expect(getImageUrl('images/googlelogo.png')).toEqual(`${process.env.CDN_BASE_URI}images/googlelogo.png`);
      expect(getImageUrl('/images/googlelogo.png')).toEqual(`${process.env.CDN_BASE_URI}images/googlelogo.png`);
    });
  });
});

