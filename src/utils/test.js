/* global describe, test, expect */
import getJsonPaths from './jsonPaths';
import getRoutePath from './routePaths';
import getExistingResourcePagePath from './resource';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from './constants';

const uiRoutePathPrefix = '/pg';

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
    expect(getRoutePath()).toEqual(`${uiRoutePathPrefix}/`);
    ['', '/', {}].forEach(r => {
      expect(getRoutePath(r)).toEqual(`${uiRoutePathPrefix}/`);
    });
    expect(getRoutePath('/')).toEqual(`${uiRoutePathPrefix}/`);
    ['editors', 'resources'].forEach(r => {
      expect(getRoutePath(`/${r}`)).toEqual(`${uiRoutePathPrefix}/${r}`);
    });
    ['something', '  something  '].forEach(r => {
      expect(getRoutePath(r)).toEqual(`${uiRoutePathPrefix}/${r.trim()}`);
    });
  });
});

describe('getExistingResourcePagePath util method', () => {
  test('should return valid path, if no resource details passed', () => {
    expect(getExistingResourcePagePath()).toEqual(`${uiRoutePathPrefix}/`);
  });
  test('should return valid path, if invalid resource type passed', () => {
    expect(getExistingResourcePagePath({ type: 'something' })).toEqual(
      `${uiRoutePathPrefix}/`
    );
  });
  ['export', 'exports', 'imports', 'stacks'].forEach(rt => {
    describe(`should return valid path for resource type ${rt}`, () => {
      test('should return valid path, if id is not passed', () => {
        expect(getExistingResourcePagePath({ type: rt })).toEqual(
          `${uiRoutePathPrefix}/${RESOURCE_TYPE_SINGULAR_TO_PLURAL[rt] ||
            rt}/undefined/edit`
        );
      });
      test('should return valid path, if id is passed', () => {
        expect(
          getExistingResourcePagePath({ type: rt, id: 'something' })
        ).toEqual(
          `${uiRoutePathPrefix}/${RESOURCE_TYPE_SINGULAR_TO_PLURAL[rt] ||
            rt}/something/edit`
        );
      });
    });
  });
});
