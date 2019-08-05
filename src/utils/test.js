/* global describe, test, expect */
import each from 'jest-each';
import getJsonPaths from './jsonPaths';
import getRoutePath from './routePaths';
import getExistingResourcePagePath from './resource';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../constants/resource';
import getRequestOptions from './requestOptions';
import actionTypes from '../actions/types';

const uiRoutePathPrefix = '/pg';

describe('Json paths util method', () => {
  test('generate all json paths for a valid JSON object', () => {
    const sampleJSON = { a: { d: '4', e: '5', f: 4 }, b: '3' };

    expect(getJsonPaths(sampleJSON)).toEqual([
      { id: 'a.d', type: 'string' },
      { id: 'a.e', type: 'string' },
      { id: 'a.f', type: 'number' },
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

describe('getRequestOptions util method', () => {
  const testCases = [
    [
      { path: '/invite', opts: { method: 'POST' } },
      actionTypes.USER_CREATE,
      {},
    ],
    [
      { path: '/ashares/someId', opts: { method: 'PUT' } },
      actionTypes.USER_UPDATE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/ashares/someId', opts: { method: 'DELETE' } },
      actionTypes.USER_DELETE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/ashares/someId/disable', opts: { method: 'PUT' } },
      actionTypes.USER_DISABLE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/transfers/invite', opts: { method: 'POST' } },
      actionTypes.USER_MAKE_OWNER,
      {},
    ],
    [
      { path: '/licenses/startTrial', opts: { method: 'POST' } },
      actionTypes.LICENSE_TRIAL_REQUEST,
      {},
    ],
    [
      { path: '/licenses/upgradeRequest', opts: { method: 'POST' } },
      actionTypes.LICENSE_UPGRADE_REQUEST,
      {},
    ],
    [
      { path: '/accesstokens', opts: { method: 'POST' } },
      actionTypes.ACCESSTOKEN_CREATE,
      {},
    ],
    [
      {
        path: '/integrations/someIntegrationId1/accesstokens',
        opts: { method: 'POST' },
      },
      actionTypes.ACCESSTOKEN_CREATE,
      { integrationId: 'someIntegrationId1' },
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'PUT' } },
      actionTypes.ACCESSTOKEN_UPDATE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'PUT' } },
      actionTypes.ACCESSTOKEN_REVOKE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'PUT' } },
      actionTypes.ACCESSTOKEN_ACTIVATE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'DELETE' } },
      actionTypes.ACCESSTOKEN_DELETE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId/display', opts: { method: 'GET' } },
      actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId/generate', opts: { method: 'POST' } },
      actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
      {
        resourceId: 'someId',
      },
    ],
  ];

  each(testCases).test(
    'should return %o for %s action with options %o',
    (expected, action, options) => {
      expect(getRequestOptions(action, options)).toEqual(expected);
    }
  );
});
