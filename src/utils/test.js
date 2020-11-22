/* global describe, test, expect */
import each from 'jest-each';
import moment from 'moment-timezone';
import actionTypes from '../actions/types';
import getJsonPaths from './jsonPaths';
import getRequestOptions from './requestOptions';
import getRoutePath from './routePaths';
import retry from './retry';
import adjustTimezone from './adjustTimezone';

const uiRoutePathPrefix = '';

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

  test('should not recurse arrays when excludeArrayIndices is true', () => {
    const sampleJSON = {
      a: {
        arr: [1, 2, 3],
        arr2: [{
          abc: 1,
          def: 42,
          moreArrays: [42, 42, 42],
        }, {
          abc: 'aaa',
          def: true,
          moreArrays2: [{
            ghi: 'jkl',
          }, {
            ghi: 'mno',
          }],
        }],
      },
      b: {
        c: 42,
      },
    };

    expect(getJsonPaths(sampleJSON, '', { excludeArrayIndices: true })).toEqual([
      { id: 'a.arr', type: 'array' },
      { id: 'a.arr2', type: 'array' },
      { id: 'b.c', type: 'number' },
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

describe('retry util', () => {
  test('should retry 5 times and fail', () => {
    let c = 0;

    return retry(() => {
      c += 1;

      return Promise.reject(new Error('fail'));
    }, 5).then(() => {
      // should not reach here
      throw new Error('unreachable');
    }).catch(ex => {
      expect(c).toEqual(5);
      expect(ex.message).toEqual('fail');
    });
  });

  test('should succeed without retrying', () => {
    let c = 0;

    return retry(() => {
      c += 1;

      return Promise.resolve(42);
    }).then(v => {
      expect(c).toEqual(1);
      expect(v).toEqual(42);
    }).catch(() => {
      // should not reach here
      throw new Error('unreachable');
    });
  });

  test('should retry and then succeed', () => {
    let c = 0;

    return retry(() => {
      c += 1;

      return c > 2 ? Promise.resolve(42) : Promise.reject(new Error('fail'));
    }).then(v => {
      expect(c).toEqual(3);
      expect(v).toEqual(42);
    }).catch(() => {
      // should not reach here
      throw new Error('unreachable');
    });
  });

  test('should work with negative retries', () => {
    let c = 0;

    return retry(() => {
      c += 1;

      return Promise.reject(new Error('fail'));
    }, -1, 0).then(() => {
      // should not reach here
      throw new Error('unreachable');
    }).catch(ex => {
      expect(c).toEqual(1);
      expect(ex.message).toEqual('fail');
    });
  });

  test('should work with NaN retries', () => {
    let c = 0;

    return retry(() => {
      c += 1;

      return Promise.reject(new Error('fail'));
    }, 'abc').then(() => {
      // should not reach here
      throw new Error('unreachable');
    }).catch(ex => {
      expect(c).toEqual(1);
      expect(ex.message).toEqual('fail');
    });
  });
});

describe('adjustTimezone', () => {
  test('should return null when non utc time stamp is provided', () => {
    const zone = 'America/Los_Angeles';
    const corruptedDateTime = '2013-11-2';

    expect(adjustTimezone(corruptedDateTime, zone)).toEqual(null);
  });
  test('should successfully adjust timezone for PST', () => {
    const zone = 'America/Los_Angeles';
    // local time stamp internally set in the component
    const inputLocalTime = '2013-11-22T19:55:00.000';

    // it gets offset internal to the browser local and converted to utc
    const dateNow = moment(inputLocalTime).toISOString();
    // check the expected output
    const expectedOutTime = moment.tz(inputLocalTime, zone).toISOString();

    expect(adjustTimezone(dateNow, zone)).toEqual(expectedOutTime);
  });
  test('should successfully adjust timezone for Asia/Tokyo', () => {
    const zone = 'Asia/Tokyo';
    // local time stamp internally set in the component
    const inputLocalTime = '2013-11-22T19:55:00.000';

    // it gets offset internal to the browser local and converted to utc
    const dateNow = moment(inputLocalTime).toISOString();
    // check the expected output
    const expectedOutTime = moment.tz(inputLocalTime, zone).toISOString();

    expect(adjustTimezone(dateNow, zone)).toEqual(expectedOutTime);
  });
});
