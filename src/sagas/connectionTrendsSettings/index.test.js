import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '..';
import {request} from '.';

describe('request saga', () => {
  const startDateString = {
    startDateString: '2023-05-22T10:00:16.303Z',
    endDateString: '2023-05-29T10:17:29.399Z',
    filterValConnection: 'online',
  };

  const response = {
    '2023-05-29': 73,
    '2023-05-28': 73,
    '2023-05-27': 73,
    '2023-05-26': 73,
    '2023-05-25': 73,
    '2023-05-24': 73,
    '2023-05-23': 73,
    '2023-05-22': 73,
  };
  const error = new Error('API error');

  test('should dispatch connectionTrends.received action on success', () => {
    expectSaga(request, startDateString)
      .provide([
        [call(apiCallWithRetry, {
          path: `/accountInsights/api/connectionsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValConnection}`,
          opts: {
            method: 'GET',
          },
        }), response],
      ])
      .put(actions.connectionTrends.received(response))
      .run();
  });

  test('should not dispatch any action on failure', () => {
    expectSaga(request, startDateString)
      .provide([
        [call(apiCallWithRetry, {
          path: `/accountInsights/api/connectionsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValConnection}`,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .not.put(actions.connectionTrends.received())
      .run();
  });
});
