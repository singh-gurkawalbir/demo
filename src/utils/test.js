/* global describe, test, expect */
import getJsonPaths from './jsonPaths';
import getRoutePath from './routePaths';

describe('Json paths util method', () => {
  test('generate all json paths for a valid JSON object', () => {
    const sampleJSON = { a: { d: '4', e: '5' }, b: '3' };

    expect(getJsonPaths(sampleJSON)).toEqual([
      { id: 'a.d', type: 'string' },
      { id: 'a.e', type: 'string' },
      { id: 'b', type: 'string' },
    ]);
  });
});

describe('Route paths util method', () => {
  test('should return valid path', () => {
    expect(getRoutePath()).toEqual('/pg/');
    expect(getRoutePath('')).toEqual('/pg/');
    expect(getRoutePath('/')).toEqual('/pg/');
    expect(getRoutePath('/editors')).toEqual('/pg/editors');
    expect(getRoutePath('/resources')).toEqual('/pg/resources');
    expect(getRoutePath('something')).toEqual('/pg/something');
    expect(getRoutePath('  something  ')).toEqual('/pg/something');
  });
});
