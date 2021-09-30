/* global describe, test, jest, expect */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select, delay } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import moment from 'moment';
// import { createMockTask } from '@redux-saga/testing-utils';
// import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../..';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import {
  getConnectionDebugLogs,
  pollForConnectionLogs,
  // startPollingForConnectionDebugLogs,
  deleteConnectionDebugLogs,
  startDebug,
} from '.';

describe('Connection debugger log sagas', () => {
  describe('getConnectionDebugLogs saga', () => {
    test('should fetch connection debug logs and yield CONNECTION_LOGS_RECEIVED action correctly', () => {
      const connectionId = 'c1';

      return expectSaga(getConnectionDebugLogs, { connectionId })
        .provide([
          [select(selectors.userProfilePreferencesProps), {dateFormat: 'MM/DD/YYYY', timeFormat: 'h:mm:ss a'}],
          [select(selectors.userTimezone), 'Asia/Calcutta'],
          [call(apiCallWithRetry, {
            path: `/connections/${connectionId}/debug`,
          }), '2021-02-25T02:09:12.230Z f1 import i1\n\n2021-02-25T02:09:12.230Z f2 import i2{"method":"POST","uri":"a"}'],
        ]).put(actions.logs.connections.received(
          connectionId,
          '02/25/2021 7:39:12 am f1 import i1\n\n02/25/2021 7:39:12 am f2 import i2{"method":"POST","uri":"a"}'
        ))
        .run();
    });

    test('should yield CONNECTION_LOGS_REQUEST_FAILED in case of error while retrieving logs', () => {
      const connectionId = 'c1';

      return expectSaga(getConnectionDebugLogs, { connectionId })
        .provide([
          [call(apiCallWithRetry, {
            path: `/connections/${connectionId}/debug`,
          }), throwError({someError: 'error'})],
        ]).put(actions.logs.connections.requestFailed(connectionId))
        .run();
    });
  });
  describe('pollForConnectionLogs saga', () => {
    test('should call getConnectionDebugLogs after 5 seconds delay continuously', () => {
      const connectionId = 'c1';
      const dateStrAfter15Mins = moment().add(15, 'm').toISOString();
      const saga = pollForConnectionLogs({ connectionId });

      saga.next();
      expect(saga.next({debugDate: dateStrAfter15Mins}).value).toEqual(call(getConnectionDebugLogs, { connectionId }));
      expect(saga.next().value).toEqual(delay(5000));

      expect(saga.next().done).toEqual(false);
    });
  });
  describe('startPollingForConnectionDebugLogs saga', () => {
    // TODO
    // test('should fork startPollingForConnectionDebugLogs, waits for connection log clear or new connection logs request action and then cancels startPollingForConnectionDebugLogs', () => {
    // const connectionId = 'c1';
    // const saga = startPollingForConnectionDebugLogs({connectionId});

    // expect(saga.next().value).toEqual(fork(pollForConnectionLogs, {connectionId}));

    // const watcherTask = createMockTask();

    // expect(saga.next(watcherTask).value).toEqual(
    //   // take(actionTypes.LOGS.CONNECTIONS.CLEAR)
    //   take(action => {
    //     if (action.type === actionTypes.LOGS.CONNECTIONS.REQUEST && action.connectionId === connectionId) {
    //       return true;
    //     }
    //     if (action.type === actionTypes.LOGS.CONNECTIONS.CLEAR) {
    //       if (action.clearAllLogs) {
    //         return true;
    //       }

    //       return action.connectionId === connectionId;
    //     }
    //   })
    // );
    // expect(saga.next().value).toEqual(cancel(watcherTask));
    // expect(saga.next().done).toEqual(true);
    // });
  });
  describe('deleteConnectionDebugLogs saga', () => {
    test('should call apiCallWithRetry with delete connection log path', () => {
      const connectionId = 'c1';

      return expectSaga(deleteConnectionDebugLogs, { connectionId })
        .call(apiCallWithRetry, { path: `/connections/${connectionId}/debug`, opts: { method: 'DELETE'}})
        .run();
    });
  });
  describe('startDebug saga', () => {
    test('should remove debugDate correctly', () => {
      const now = new Date();
      const mock = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => now);

      mock.mockReturnValue(now);

      expectSaga(startDebug, { connectionId: 'c1', value: '0'})
        .put(actions.resource.patch('connections', 'c1',
          [
            {
              op: 'remove',
              path: '/debugDate',
              value: moment(new Date()).add('0', 'm').toISOString(),
            },
          ]
        ))
        .run();
      mock.mockRestore();
    });
    test('should set debugDate correctly', () => {
      const now = new Date();
      const newDebugDate = moment(now).add('15', 'm').toISOString();

      const mock = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => now);

      mock.mockReturnValue(now);

      expectSaga(startDebug, { connectionId: 'c1', value: '15'})
        .put(actions.resource.patch('connections', 'c1',
          [
            {
              op: 'replace',
              path: '/debugDate',
              value: newDebugDate,
            },
          ]
        ))
        .run();
      mock.mockRestore();
    });
  });
});
