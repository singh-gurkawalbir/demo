/* global describe, test, expect */
import each from 'jest-each';
import getJsonPaths from './jsonPaths';
import getRoutePath from './routePaths';
import getExistingResourcePagePath from './resource';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../constants/resource';
import getRequestOptions from './requestOptions';
import actionTypes from '../actions/types';
import resourceConflictResolution from './resourceConflictResolution';

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
            rt}/edit/${RESOURCE_TYPE_SINGULAR_TO_PLURAL[rt] || rt}/undefined`
        );
      });
      test('should return valid path, if id is passed', () => {
        expect(
          getExistingResourcePagePath({ type: rt, id: 'something' })
        ).toEqual(
          `${uiRoutePathPrefix}/${RESOURCE_TYPE_SINGULAR_TO_PLURAL[rt] ||
            rt}/edit/${RESOURCE_TYPE_SINGULAR_TO_PLURAL[rt] || rt}/something`
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

describe('resourceConflictResolution', () => {
  /*
  Some background to these test cases:
    
  master: this refers to the local unaltered of a record
  origin: this refers to the latest copy of that record from the server
  merged: this refers to local changes on top of master


  */

  const master = {
    a: '1',
    b: '2',
    lastModified: 12,
  };
  const alteredMerged = {
    a: '1',
    b: '3',
    lastModified: 12,
  };
  const unalteredOrigin = {
    a: '1',
    b: '2',
    lastModified: 14,
  };
  const alteredOrigin = {
    a: '0',
    b: '2',
    lastModified: 14,
  };

  test('should return no conflict with merged unaltered when master and origin hasn`t changed ', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: master,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict with merged unaltered when master and origin has changed but values remain the same', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: unalteredOrigin,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict with merged incorporating origin changes when master and merged remain the same but origin values differ from master', () => {
    const result = resourceConflictResolution({
      master,
      merged: master,
      origin: alteredOrigin,
    });
    const resolvedMerged = {
      a: '0',
      b: '2',
      lastModified: 12,
    };

    expect(result).toEqual({
      conflict: null,

      merged: resolvedMerged,
    });
  });

  describe('mutual properties of merged and origin has changed', () => {
    const master = {
      a: '1',
      b: '2',
      lastModified: 12,
    };
    const alteredMerged = {
      a: '1',
      b: '3',
      lastModified: 12,
    };
    const alteredOrigin = {
      a: '2',
      b: '2',
      lastModified: 14,
    };
    const unresolvableMerged = {
      a: '4',
      b: '3',
      lastModified: 12,
    };

    test('should return no conflict with merged incorporating resolvable origin changes when master and origin has changed', () => {
      const result = resourceConflictResolution({
        master,
        merged: alteredMerged,
        origin: alteredOrigin,
      });
      const resolvedMerged = {
        a: '2',
        b: '3',
        lastModified: 12,
      };

      // i apply automatic resolution when staged and master hasn't changed..then i incorporate origin changes

      expect(result).toEqual({
        conflict: null,

        merged: resolvedMerged,
      });
    });
    test('should return a conflict with merged incorporating resolvable origin changes when master and origin has changes are unresolvable', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMerged,
        origin: alteredOrigin,
      });
      // in this case origin has changes....and i cannot apply any automatic resolution changes ..since i have stagged some changes which are completely
      const resolvedMerged = {
        a: '4',
        b: '3',
        lastModified: 12,
      };
      const conflictPatches = [{ op: 'replace', path: '/a', value: '2' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: resolvedMerged,
      });
    });
  });
});
