import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '..';
import {request} from '.';

describe('request saga', () => {
  const startDateString = {
    startDateString: '2023-05-17T18:30:00.000Z',
    endDateString: '2023-05-24T12:36:02.002Z',
    filterValFlow: 'enabled',
  };
  const response = {
    '2023-05-24': 18,
    '2023-05-23': 18,
    '2023-05-22': 18,
    '2023-05-21': 18,
    '2023-05-20': 18,
    '2023-05-19': 18,
    '2023-05-18': 18,
    '2023-05-17': 18,
  };
  const error = new Error('API error');

  test('should dispatch flowTrends.received action on success', () => {
    expectSaga(request, startDateString)
      .provide([
        [call(apiCallWithRetry, {
          path: `/accountInsights/api/flowsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValFlow}`,
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
          path: `/accountInsights/api/flowsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValFlow}`,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .not.put(actions.flowTrends.received())
      .run();
  });
});
