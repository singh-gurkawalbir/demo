import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '..';
import {
  getPreference,
  postPreference,
} from '.';

describe('getPreference saga', () => {
  const response = 'mockRespone';

  test('should dispatch dashboard received action on success', () => expectSaga(getPreference)
    .provide([
      [call(apiCallWithRetry, {
        path: '/accountInsights/api/dashboards',
        opts: {
          method: 'GET',
        },
      }), response],
    ])
    .put(actions.dashboard.received(response))
    .run());

  test('should not dispatch any action on failure', () => {
    const error = new Error('API error');

    expectSaga(getPreference)
      .provide([
        [call(apiCallWithRetry, {
          path: '/accountInsights/api/dashboards',
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .not.put(actions.dashboard.received())
      .run();
  });
});

describe('postPreference saga', () => {
  const layouts = 'mockLayouts';
  const graphTypes = 'mockGraphTypes';
  const data = 'mockData';
  const error = new Error('API error');

  test('should dispatch preferencePosted action on successful API call', () => {
    const response = { Mock: 'Response'};

    expectSaga(postPreference, { layouts, graphTypes })
      .provide([
        [select(selectors.getData), data],
        [call(apiCallWithRetry, {
          path: '/accountInsights/api/dashboards/646c71f3a5e5b87a4a52dda1',
          opts: {
            body: { ...data, layouts, graphTypes },
            method: 'PUT',
          },
        }), response],
      ])
      .put(actions.dashboard.preferencePosted(response))
      .run();
  });

  test('should dispatch preferencePostFailed action on failure', () => {
    expectSaga(postPreference, { layouts, graphTypes })
      .provide([
        [select(selectors.getData), data],
        [call(apiCallWithRetry, {
          path: '/accountInsights/api/dashboards/646c71f3a5e5b87a4a52dda1',
          opts: {
            body: { ...data, layouts, graphTypes },
            method: 'PUT',
          },
        }), throwError(error)],
      ])
      .put(actions.dashboard.preferencePostFailed(error))
      .run();
  });
});
