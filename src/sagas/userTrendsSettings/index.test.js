import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '..';
import {request} from '.';

describe('request saga', () => {
  const startDateString = {
    startDateString: '2023-05-10T18:30:00.000Z',
    endDateString: '2023-05-25T08:54:12.216Z',
    filterValFlow: 'enabled',
  };

  const response = {
    '2023-05-25': 10,
    '2023-05-24': 10,
    '2023-05-23': 10,
    '2023-05-22': 10,
    '2023-05-21': 10,
    '2023-05-20': 10,
    '2023-05-19': 10,
    '2023-05-18': 10,
    '2023-05-17': 10,
    '2023-05-16': 10,
    '2023-05-15': 9,
    '2023-05-14': 9,
    '2023-05-13': 9,
    '2023-05-12': 9,
    '2023-05-11': 9,
    '2023-05-10': 7,
  };
  const error = new Error('API error');

  test('should dispatch flowTrends.received action on success', () => {
    expectSaga(request, startDateString)
      .provide([
        [call(apiCallWithRetry, {
          path: `/accountInsights/api/usersTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValUser}`,
          opts: {
            method: 'GET',
          },
        }), response],
      ])
      .put(actions.flowTrends.received(response))
      .run();
  });

  test('should not dispatch any action on failure', () => {
    expectSaga(request, startDateString)
      .provide([
        [call(apiCallWithRetry, {
          path: `/accountInsights/api/usersTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValUser}`,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .not.put(actions.flowTrends.received())
      .run();
  });
});
