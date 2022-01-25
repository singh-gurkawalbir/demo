// TODO: Figure out how to configure the linter to ignore warnings about global
// references introduced by JEST. Witout the below exclusion in every test file,
// the linter precommit step will fail. ...and the IDE doesnt like the globals
// either.
/* global describe, test, expect */
import reducer, { COMM_STATES, COMM_STATES as STATES, selectors } from './index';
import actions from '../../../actions';
import commKeyGenerator from '../../../utils/commKeyGenerator';
import { emptyObject } from '../../../utils/constants';
import { changeEmailParams, changePasswordParams } from '../../../sagas/api/apiPaths';

// Reference: JEST "matcher" doc: https://jestjs.io/docs/en/using-matchers

describe('comms reducers', () => {
  const path = '/test/path/';
  const method = 'GET';
  const commKey = commKeyGenerator(path, method);

  describe('clear comms action ', () => {
    test('clear the comms part of the redux store', () => {
      const newState = reducer(undefined, actions.api.request(path, method));
      let completedApiActionState = reducer(
        newState,
        actions.api.complete(path, method)
      );
      const failedApiResourcePath = '/sisnifdif';

      completedApiActionState = reducer(
        completedApiActionState,
        actions.api.failure(failedApiResourcePath, method)
      );

      // now wipe out the comms store
      const wipedOutCommsState = reducer(
        completedApiActionState,
        actions.api.clearComms()
      );

      expect(wipedOutCommsState).not.toMatchObject({
        failedApiResourcePath: { loading: false },
      });
    });
    test('should not clear comms in loading state', () => {
      const state = reducer(undefined, actions.api.request(path, method));
      const wipedOutCommsState = reducer(
        state,
        actions.api.clearComms()
      );

      expect(wipedOutCommsState).not.toEqual({});
    });
  });

  describe('request action', () => {
    test('should set loading flag', () => {
      const newState = reducer(undefined, actions.api.request(path, method));

      expect(newState[commKey].status).toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, method));

      expect(newState[commKey].retry).toBeUndefined();
    });
  });

  describe('completed action', () => {
    test('should create commKey in the state if it does not exist', () => {
      const newState = reducer(undefined, actions.api.complete(path, method));

      expect(newState[commKey].status).not.toBe(STATES.LOADING);
    });
    test('should clear loading flag', () => {
      const state = reducer(undefined, actions.api.request(path, method));

      expect(state[commKey].status).toBe(STATES.LOADING);

      const newState = reducer(state, actions.api.complete(path, method));

      expect(newState[commKey].status).not.toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, method));

      expect(newState[commKey].retry).toBeUndefined();
    });
  });

  describe('failure action', () => {
    test('should set error message', () => {
      const state = reducer(
        undefined,
        actions.api.failure(path, method, 'error')
      );

      expect(state[commKey].message).toEqual('error');
    });
    test('should default an error message if none is provided in the action', () => {
      const state = reducer(undefined, actions.api.failure(path, method));

      expect(state[commKey].message).toEqual('unknown error');
    });
    test('should clear loading and retry count', () => {
      let state = reducer(undefined, actions.api.request(path, method));

      state = reducer(state, actions.api.retry(path, method));
      expect(state[commKey].status).toBe(STATES.LOADING);
      expect(state[commKey].retry).toBe(1);

      state = reducer(state, actions.api.failure(path, method, 'error'));

      expect(state[commKey].status).toBe(STATES.ERROR);
      expect(state[commKey].retry).toBeUndefined();
    });
  });

  describe('retry action', () => {
    test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      let newState = reducer(state, actions.api.retry(path, method));

      expect(newState[commKey].retry).toBe(2);

      newState = reducer(newState, actions.api.retry(path, method));

      expect(newState[commKey].retry).toBe(3);
    });
  });

  describe('clear comm by key', () => {
    test('should not change the state when key not found', () => {
      const state = reducer(undefined, 'some action');
      const newState = reducer(state, actions.api.clearCommByKey('something'));

      expect(newState).toEqual(state);
    });
    test('should remove the key from state', () => {
      const state = reducer(
        {
          something: { test: 'something' },
          somethingelse: { test: 'somethingelse' },
        },
        'some action'
      );
      const newState = reducer(state, actions.api.clearCommByKey('something'));

      expect(newState).toEqual({ somethingelse: { test: 'somethingelse' } });
    });
  });
});

describe('comms selectors', () => {
  const path = '/test/path';
  const method = 'GET';
  const commKey = commKeyGenerator(path, method);

  describe('networkCommState', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.networkCommState()).toBeUndefined();
      expect(selectors.networkCommState({})).toEqual({});
    });
    test('should return network comm state', () => {
      const state = {key: {message: 'error'}};

      expect(selectors.networkCommState(state)).toEqual(state);
    });
  });
  describe('commStatusByKey', () => {
    test('should return correct status', () => {
      const state = reducer(
        {
          'GET:/test': { something: 'something' },
        },

        'some action'
      );

      expect(selectors.commStatusByKey(state, 'GET:/test')).toEqual({
        something: 'something',
      });
    });
    test('should return undefined if key not found', () => {
      const state = reducer(
        {
          comms: {
            networkComms: {
              'GET:/test': { something: 'something' },
            },
          },
        },
        'some action'
      );

      expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
        undefined
      );
    });
    test('should return undefined if state is undefined', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
        undefined
      );
    });
  });
  describe('commReqType', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.commReqType()).toEqual('GET');
      expect(selectors.commReqType({})).toEqual('GET');
      expect(selectors.commReqType({}, 'get')).toEqual('GET');
      expect(selectors.commReqType(undefined, 'get')).toEqual('GET');
    });
    test('should return correct comm request method for given resource', () => {
      const state = reducer(
        {
          'GET:/something': { method: 'PUT' },
        },
        'some action'
      );

      expect(selectors.commReqType(state, 'GET:/something')).toEqual('PUT');
    });
  });
  describe('isRefreshing', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.isRefreshing()).toBeFalsy();
      expect(selectors.isRefreshing({})).toBeFalsy();
      expect(selectors.isRefreshing({}, 'get')).toBeFalsy();
      expect(selectors.isRefreshing(undefined, 'get')).toBeFalsy();
    });
    test('should return true if comm is refreshing', () => {
      const state = reducer(
        {
          'GET:/something': { refresh: true},
        },
        'some action'
      );

      expect(selectors.isRefreshing(state, 'GET:/something')).toBeTruthy();
    });
  });
  describe('isValidatingNetsuiteUserRoles', () => {
    const commPath = commKeyGenerator('/netsuite/alluserroles', 'POST');

    test('should not throw exception for invalid arguments', () => {
      expect(selectors.isValidatingNetsuiteUserRoles()).toBeFalsy();
      expect(selectors.isValidatingNetsuiteUserRoles({})).toBeFalsy();
      expect(selectors.isValidatingNetsuiteUserRoles({}, 'get')).toBeFalsy();
      expect(selectors.isValidatingNetsuiteUserRoles(undefined, 'get')).toBeFalsy();
    });
    test('should return true if comm status is loading for netsuite user roles', () => {
      const state = reducer(
        {
          [commPath]: { status: COMM_STATES.LOADING},
        },
        'some action'
      );

      expect(selectors.isValidatingNetsuiteUserRoles(state)).toBeTruthy();
    });
  });
  describe('reqsHasRetriedTillFailure', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.reqsHasRetriedTillFailure()).toBeFalsy();
      expect(selectors.reqsHasRetriedTillFailure({})).toBeFalsy();
      expect(selectors.reqsHasRetriedTillFailure({}, 'get')).toBeFalsy();
      expect(selectors.reqsHasRetriedTillFailure(undefined, 'get')).toBeFalsy();
    });
    test('should return correct retry count for comm', () => {
      const state = reducer(
        {
          someKey: { retry: 3},
        },
        'some action'
      );

      expect(selectors.reqsHasRetriedTillFailure(state)).toBeTruthy();
    });
  });
  describe('commStatus', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.commStatus()).toBeFalsy();
      expect(selectors.commStatus({})).toBeFalsy();
      expect(selectors.commStatus({}, 'get')).toBeFalsy();
      expect(selectors.commStatus(undefined, 'get')).toBeFalsy();
    });
    test('should return correct comm status for given resource', () => {
      const state = reducer(
        {
          someKey: { status: COMM_STATES.SUCCESS},
        },
        'some action'
      );

      expect(selectors.commStatus(state, 'someKey')).toEqual(COMM_STATES.SUCCESS);
    });
  });
  describe('requestMessage', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.requestMessage()).toBeFalsy();
      expect(selectors.requestMessage({})).toBeFalsy();
      expect(selectors.requestMessage({}, 'get')).toBeFalsy();
      expect(selectors.requestMessage(undefined, 'get')).toBeFalsy();
    });
    test('should return correct comm message', () => {
      const state = reducer(
        {
          someKey: { message: 'something'},
        },
        'some action'
      );

      expect(selectors.requestMessage(state, 'someKey')).toEqual('something');
    });
  });
  describe('timestampComms', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.timestampComms()).toBeFalsy();
      expect(selectors.timestampComms({})).toBeFalsy();
      expect(selectors.timestampComms({}, 'get')).toBeFalsy();
      expect(selectors.timestampComms(undefined, 'get')).toBeFalsy();
    });
    test('should return correct comm timestamp', () => {
      const state = reducer(
        {
          someKey: { timestamp: 123432},
        },
        'some action'
      );

      expect(selectors.timestampComms(state, 'someKey')).toEqual(123432);
    });
  });
  describe('retryCount', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.retryCount()).toEqual(0);
      expect(selectors.retryCount({})).toEqual(0);
      expect(selectors.retryCount({}, 'get')).toEqual(0);
      expect(selectors.retryCount(undefined, 'get')).toEqual(0);
    });
    test('should return correct retry count for comm', () => {
      const state = reducer(
        {
          someKey: { retry: 123432},
        },
        'some action'
      );

      expect(selectors.retryCount(state, 'someKey')).toEqual(123432);
    });
  });
  describe('commsErrors', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.commsErrors()).toBeUndefined();
      expect(selectors.commsErrors({})).toEqual({});
      expect(selectors.commsErrors({}, 'get')).toEqual({});
      expect(selectors.commsErrors(undefined, 'get')).toBeUndefined();
    });
    test('should return correct object for comm errors', () => {
      const state = reducer(
        {
          someKey: { status: COMM_STATES.ERROR, hidden: false, failedAtTimestamp: 123, message: 'message'},
        },
        'some action'
      );

      expect(selectors.commsErrors(state)).toEqual({123: 'message'});
      expect(selectors.commsErrors({...state, someKey: {}})).toEqual({});
    });
  });
  describe('commsSummary', () => {
    test('should not throw exception for invalid arguments', () => {
      const defaultValues = { isLoading: false, isRetrying: false, hasError: false };

      expect(selectors.commsSummary()).toEqual(defaultValues);
      expect(selectors.commsSummary({})).toEqual(defaultValues);
      expect(selectors.commsSummary({}, 'get')).toEqual(defaultValues);
      expect(selectors.commsSummary(undefined, 'get')).toEqual(defaultValues);
    });
    test('should return correct correct comms summary', () => {
      const state = reducer(
        {
          1: { status: COMM_STATES.ERROR, hidden: false, failedAtTimestamp: 123 },
          2: { status: COMM_STATES.ERROR, hidden: true, failedAtTimestamp: 123 },
          3: { retryCount: 3, hidden: false, failedAtTimestamp: 123},
          4: { status: COMM_STATES.LOADING, hidden: false, timestamp: 123},
          5: { status: COMM_STATES.SUCCESS, hidden: false, timestamp: 123},
        },
        'some action'
      );

      expect(selectors.commsSummary(state)).toEqual({ isLoading: true, isRetrying: true, hasError: true });
    });
  });
  describe('commStatusPerPath', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.commStatusPerPath()).toBeUndefined();
      expect(selectors.commStatusPerPath({})).toBeUndefined();
      expect(selectors.commStatusPerPath({}, 'get')).toBeUndefined();
      expect(selectors.commStatusPerPath(undefined, 'get')).toBeUndefined();
    });
    test('should return correct status for given path and method', () => {
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.LOADING},
        },
        'some action'
      );

      expect(selectors.commStatusPerPath(state, path, method)).toEqual(COMM_STATES.LOADING);
    });
  });
  describe('mkActionsToMonitorCommStatus', () => {
    const selector = selectors.mkActionsToMonitorCommStatus();

    test('should not throw exception for invalid arguments', () => {
      expect(selector()).toEqual(emptyObject);
      expect(selector({}, '123')).toEqual(emptyObject);
      expect(selector(undefined, '123')).toEqual(emptyObject);
    });
    test('should return correct status for given actions to monitor', () => {
      const commKey = commKeyGenerator('/jobs/1', 'GET');
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.LOADING},
        },
        'some action'
      );
      const actionsToMonitor = {request: {path, opts: {method}, resourceId: '1', integrationId: '1'}};

      expect(selector(state, actionsToMonitor)).toEqual({request: {status: 'loading'}});
    });
  });
  describe('changePasswordSuccess', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changePasswordSuccess()).toBeFalsy();
      expect(selectors.changePasswordSuccess({}, '123')).toBeFalsy();
      expect(selectors.changePasswordSuccess(undefined, '123')).toBeFalsy();
    });
    test('should return true if password change is successful', () => {
      const commKey = commKeyGenerator(
        changePasswordParams.path,
        changePasswordParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.SUCCESS},
        },
        'some action'
      );

      expect(selectors.changePasswordSuccess(state)).toBeTruthy();
    });
  });
  describe('changePasswordFailure', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changePasswordFailure()).toBeFalsy();
      expect(selectors.changePasswordFailure({}, '123')).toBeFalsy();
      expect(selectors.changePasswordFailure(undefined, '123')).toBeFalsy();
    });
    test('should return true if password change failed', () => {
      const commKey = commKeyGenerator(
        changePasswordParams.path,
        changePasswordParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.ERROR},
        },
        'some action'
      );

      expect(selectors.changePasswordFailure(state)).toBeTruthy();
    });
  });
  describe('changePasswordMsg', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changePasswordMsg()).toEqual('');
      expect(selectors.changePasswordMsg({}, '123')).toEqual('');
      expect(selectors.changePasswordMsg(undefined, '123')).toEqual('');
    });
    test('should return comm message for password change', () => {
      const commKey = commKeyGenerator(
        changePasswordParams.path,
        changePasswordParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {message: 'message'},
        },
        'some action'
      );

      expect(selectors.changePasswordMsg(state)).toEqual('message');
    });
  });
  describe('changeEmailSuccess', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changeEmailSuccess()).toBeFalsy();
      expect(selectors.changeEmailSuccess({}, '123')).toBeFalsy();
      expect(selectors.changeEmailSuccess(undefined, '123')).toBeFalsy();
    });
    test('should return true if email change is successful', () => {
      const commKey = commKeyGenerator(
        changeEmailParams.path,
        changeEmailParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.SUCCESS},
        },
        'some action'
      );

      expect(selectors.changeEmailSuccess(state)).toBeTruthy();
    });
  });
  describe('changeEmailFailure', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changeEmailFailure()).toBeFalsy();
      expect(selectors.changeEmailFailure({}, '123')).toBeFalsy();
      expect(selectors.changeEmailFailure(undefined, '123')).toBeFalsy();
    });
    test('should return true if email change is unsuccessful', () => {
      const commKey = commKeyGenerator(
        changeEmailParams.path,
        changeEmailParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {status: COMM_STATES.ERROR},
        },
        'some action'
      );

      expect(selectors.changeEmailFailure(state)).toBeTruthy();
    });
  });
  describe('changeEmailMsg', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.changeEmailMsg()).toEqual('');
      expect(selectors.changeEmailMsg({}, '123')).toEqual('');
      expect(selectors.changeEmailMsg(undefined, '123')).toEqual('');
    });
    test('should return correct comm message for email change', () => {
      const commKey = commKeyGenerator(
        changeEmailParams.path,
        changeEmailParams.opts.method
      );
      const state = reducer(
        {
          [commKey]: {message: 'message'},
        },
        'some action'
      );

      expect(selectors.changeEmailMsg(state)).toEqual('message');
    });
  });
  describe('isLoading', () => {
    test('should be false on initial state', () => {
      const isLoading = selectors.isLoading(undefined, commKey);

      expect(isLoading).toBe(false);
    });

    test('should be true after request action', () => {
      const state = reducer(undefined, actions.api.request(path, method));
      const isLoading = selectors.isLoading(state, commKey);

      expect(isLoading).toBe(true);
    });

    test('should be false after received action', () => {
      const state = reducer(undefined, actions.resource.received(path));
      const isLoading = selectors.isLoading(state, commKey);

      expect(isLoading).toBe(false);
    });
  });
  describe('retryCount', () => {
    test('should be 0 on initial state', () => {
      const count = selectors.retryCount(undefined, commKey);

      expect(count).toBe(0);
    });

    test('should be 1 after first retry action', () => {
      const state = reducer(undefined, actions.api.retry(path, method));
      const count = selectors.retryCount(state, commKey);

      expect(count).toBe(1);
    });

    test('should increase by 1 after each retry action', () => {
      let state;

      for (let i = 1; i < 5; i += 1) {
        state = reducer(state, actions.api.retry(path, method));
        const count = selectors.retryCount(state, commKey);

        expect(count).toBe(i);
      }
    });
  });
});
