/* global describe, test, expect */
import each from 'jest-each';
import moment from 'moment-timezone';
import actionTypes from '../actions/types';
import getJsonPaths from './jsonPaths';
import getRequestOptions from './requestOptions';
import getRoutePath from './routePaths';
import retry from './retry';
import adjustTimezone from './adjustTimezone';
import inferErrorMessages from './inferErrorMessages';
import flowgroupingsRedirectTo, { redirectToFirstFlowGrouping } from './flowgroupingsRedirectTo';
import { UNASSIGNED_SECTION_ID } from './constants';
import { getAsyncKey } from './saveAndCloseButtons';

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

    expect(getJsonPaths(sampleJSON, '', { excludeArrayIndices: true, includeArrayLength: true })).toEqual([
      { id: 'a.arr', type: 'array' },
      { id: 'a.arr.length', type: 'number' },
      { id: 'a.arr2', type: 'array' },
      { id: 'a.arr2.length', type: 'number' },
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
      actionTypes.USER.CREATE,
      {},
    ],
    [
      { path: '/ashares/someId', opts: { method: 'PUT' } },
      actionTypes.USER.UPDATE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/ashares/someId', opts: { method: 'DELETE' } },
      actionTypes.USER.DELETE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/ashares/someId/disable', opts: { method: 'PUT' } },
      actionTypes.USER.DISABLE,
      { resourceId: 'someId' },
    ],
    [
      { path: '/transfers/invite', opts: { method: 'POST' } },
      actionTypes.USER.MAKE_OWNER,
      {},
    ],
    [
      { path: '/licenses/startTrial', opts: { method: 'POST' } },
      actionTypes.LICENSE.TRIAL_REQUEST,
      {},
    ],
    [
      { path: '/licenses/upgradeRequest', opts: { method: 'POST' } },
      actionTypes.LICENSE.UPGRADE_REQUEST,
      {},
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'PUT' } },
      actionTypes.ACCESSTOKEN.REVOKE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId', opts: { method: 'PUT' } },
      actionTypes.ACCESSTOKEN.ACTIVATE,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId/display', opts: { method: 'GET' } },
      actionTypes.ACCESSTOKEN.DISPLAY,
      {
        resourceId: 'someId',
      },
    ],
    [
      { path: '/accesstokens/someId/generate', opts: { method: 'POST' } },
      actionTypes.ACCESSTOKEN.GENERATE,
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
  describe('daylight saving time ', () => {
    test('should successfully adjust timezone with daylight saving time -07:00 offset for PST', () => {
      const zone = 'America/Los_Angeles';
      // local time stamp internally set in the component
      const inputLocalTime = '2020-10-18';

      // it gets offset internal to the browser local and converted to utc
      const dateNow = moment(inputLocalTime).toISOString();
      // check the expected output
      const expectedOutTime = moment.tz(inputLocalTime, zone).toISOString();

      expect(adjustTimezone(dateNow, zone)).toEqual(expectedOutTime);
    });
    test('should successfully adjust timezone with daylight saving time -08:00 offset for PST', () => {
      const zone = 'America/Los_Angeles';
      // local time stamp internally set in the component
      const inputLocalTime = '2020-11-18';

      // it gets offset internal to the browser local and converted to utc
      const dateNow = moment(inputLocalTime).toISOString();

      // check the expected output
      const expectedOutTime = moment.tz(inputLocalTime, zone).toISOString();

      expect(adjustTimezone(dateNow, zone)).toEqual(expectedOutTime);
    });
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

describe('inferErrorMessages expect errored api message in this format { message, errors } ', () => {
  describe('invalid inputs', () => {
    test('should return [] for null or undefined inputs', () => {
      expect(inferErrorMessages(null)).toEqual([]);
      expect(inferErrorMessages(undefined)).toEqual([]);
    });

    test('should return just the input in an array for non parsable input messages', () => {
      expect(inferErrorMessages('some error')).toEqual(['some error']);
    });
    test('should return [] for parsable input messages with non message or errors properties', () => {
      expect(inferErrorMessages({a: 'something', b: 'something1'})).toEqual([]);
    });
  });
  describe('valid { message, errors }', () => {
    test('should parse { message} in api message and just return it, this is seen in csrf api errored calls', () => {
      expect(inferErrorMessages({message: 'csrf error'})).toEqual(['csrf error']);
    });
    test('should parse stringified input messages consisting of { message} and just return it, this is seen in csrf api errored calls', () => {
      expect(inferErrorMessages(JSON.stringify({message: 'csrf error'}))).toEqual(['csrf error']);
    });
    test('should parse { errors } property in api message, and translate it to a collection of error messages', () => {
      expect(inferErrorMessages({errors: ['api failure1', 'api failure2']})).toEqual(['api failure1', 'api failure2']);
      expect(inferErrorMessages({errors: [{message: 'api failure1'}, {message: 'api failure2'}]})).toEqual(['api failure1', 'api failure2']);
    });

    test('should be able to parse stringified inputs consisting of error property and return a collection of error messages', () => {
      expect(inferErrorMessages(JSON.stringify({errors: ['api failure1', 'api failure2']}))).toEqual(['api failure1', 'api failure2']);
      expect(inferErrorMessages(JSON.stringify({errors: [{message: 'api failure1'}, {message: 'api failure2'}]})))
        .toEqual(['api failure1', 'api failure2']);
    });
    test('should return {errors} value unit array if {errors} is not an array but a string', () => {
      expect(inferErrorMessages({errors: 'api failure1'})).toEqual(['api failure1']);
      expect(inferErrorMessages(JSON.stringify({errors: 'api failure1'}))).toEqual(['api failure1']);
    });
    test('should return stringified {errors} value unit array if {errors} is not an array but an object', () => {
      expect(inferErrorMessages({errors: {e1: 'api failure1', e2: 'api failure2'}})).toEqual([JSON.stringify({e1: 'api failure1', e2: 'api failure2'})]);
      expect(inferErrorMessages(JSON.stringify({errors: {e1: 'api failure1', e2: 'api failure2'}}))).toEqual([JSON.stringify({e1: 'api failure1', e2: 'api failure2'})]);
    });
  });
});

describe('flowgroupingsRedirectTo', () => {
  const baseRoute = '/baseRoute';
  const defaultSectionId = 'general';

  test('should redirect the page to base route when attempting sectionId for an IA without flowgroupings', () => {
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
      },
      url: `${baseRoute}/sections/someId`,
    };

    expect(flowgroupingsRedirectTo(match, null, defaultSectionId)).toEqual(baseRoute);
  });
  test('should redirect the page to the default section route when attempting an invalid sectionId for an IA with flowgroupings', () => {
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: 'inValidId',
      },
      url: `${baseRoute}/sections/inValidId`,
    };
    const flowGroupings = [{ sectionId: defaultSectionId}];

    expect(flowgroupingsRedirectTo(match, flowGroupings, defaultSectionId)).toEqual(`${baseRoute}/sections/general`);
  });

  test('should return null when attempting a valid sectionId for an IA with flowgroupings', () => {
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: 'validSectionId',
      },
      url: `${baseRoute}/sections/validSectionId`,
    };
    const flowGroupings = [{ sectionId: defaultSectionId}, { sectionId: 'validSectionId' }];

    expect(flowgroupingsRedirectTo(match, flowGroupings, defaultSectionId)).toEqual(null);
  });

  test('should return default sectionId route when attempting a route without a sectionId but has flowGroupings', () => {
    const match = {
      path: baseRoute,
      params: {
      },
      url: baseRoute,
    };
    const flowGroupings = [{ sectionId: defaultSectionId}];

    expect(flowgroupingsRedirectTo(match, flowGroupings, defaultSectionId)).toEqual(`${baseRoute}/sections/general`);
  });
  test('should return null when attempting a route without flowGroupings', () => {
    const match = {
      path: baseRoute,
      params: {
      },
      url: baseRoute,
    };
    const flowGroupings = null;

    expect(flowgroupingsRedirectTo(match, flowGroupings, defaultSectionId)).toEqual(null);
  });
});

describe('redirectFirstFlowGrouping', () => {
  const baseRoute = '/baseRoute';

  test('when attempting an invalid route with no flowGrouping redirect to baseRoute ', () => {
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: 'inValidId',
      },
      url: `${baseRoute}/sections/inValidId`,
    };
    const flowGroupings = null;
    const hasUnassignedSection = null;

    expect(redirectToFirstFlowGrouping(flowGroupings, match, hasUnassignedSection)).toEqual(`${baseRoute}`);
  });

  test('when attempting an invalid route with flowGroupings present should redirect to first flowgrouping', () => {
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: 'inValidId',
      },
      url: `${baseRoute}/sections/inValidId`,
    };
    const flowGroupings = [{ sectionId: 'firstGroupId'}];
    const hasUnassignedSection = false;

    expect(redirectToFirstFlowGrouping(flowGroupings, match, hasUnassignedSection)).toEqual(`${baseRoute}/sections/firstGroupId`);
  });
  test('when attempting an unassigned section route with hasUnassignedSection as true then should return null since it is a valid route', () => {
    // in this case we will have a unassigned section
    /// the util fn will return null since we are attempting a valid route
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: UNASSIGNED_SECTION_ID,
      },
      url: `${baseRoute}/sections/${UNASSIGNED_SECTION_ID}`,
    };
    const flowGroupings = [{ sectionId: 'firstGroupId'}];
    const hasUnassignedSection = true;

    expect(redirectToFirstFlowGrouping(flowGroupings, match, hasUnassignedSection)).toEqual(null);
  });
  test('when attempting a flow group route with hasUnassignedSection as true but without flow groupings then should return path to unassigned section', () => {
    // this case is trigerred when we are searching for a flow in Unassigned section
    /// the util fn will return null since we are attempting a valid route
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: 'firstGroupId',
      },
      url: `${baseRoute}/sections/firstGroupId`,
    };
    const flowGroupings = [];
    const hasUnassignedSection = true;

    expect(redirectToFirstFlowGrouping(flowGroupings, match, hasUnassignedSection)).toEqual(`${baseRoute}/sections/${UNASSIGNED_SECTION_ID}`);
  });

  test('when attempting a unassigned section route with hasUnassignedSection as false then should return firstFlowGroupId', () => {
    // we will still have all flowGrouping sections
    const match = {
      path: `${baseRoute}/sections/:sectionId`,
      params: {
        sectionId: UNASSIGNED_SECTION_ID,
      },
      url: `${baseRoute}/sections/${UNASSIGNED_SECTION_ID}`,
    };
    const flowGroupings = [{ sectionId: 'firstGroupId'}];
    const hasUnassignedSection = false;

    expect(redirectToFirstFlowGrouping(flowGroupings, match, hasUnassignedSection)).toEqual(`${baseRoute}/sections/firstGroupId`);
  });
});

describe('saveAndCloseButtons tests', () => {
  describe('getAsyncKey tests', () => {
    test('should not throw errors on invalid props', () => {
      expect(getAsyncKey()).toEqual('undefined-undefined');
    });
    test('should return resourceType-resourceId as a string on passing correct arguments', () => {
      expect(getAsyncKey('exports', '324324')).toEqual('exports-324324');
    });
  });
});
