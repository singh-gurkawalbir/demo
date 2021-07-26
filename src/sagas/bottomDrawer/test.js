/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import moment from 'moment';
import { addTab, bottomDrawerInit, switchTab } from '.';
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '..';

import actions from '../../actions';
import { selectors } from '../../reducers';

describe('flow builder bottom drawer sagas', () => {
  describe('bottomDrawerInit sagas', () => {
    const flowId = 'f1';

    test('should trigger initComplete action correctly ', () => expectSaga(bottomDrawerInit, { flowId })
      .provide([
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), false],
        [select(selectors.getScriptsTiedToFlow, flowId), []],
      ])
      .put(actions.bottomDrawer.initComplete(
        [
          {label: 'Dashboard', tabType: 'dashboard'},
          {label: 'Connections', tabType: 'connections'},
          {label: 'Audit Log', tabType: 'auditLogs'},
        ]
      ))
      .run());

    test('should trigger initComplete action correctly[2]', () => expectSaga(
      bottomDrawerInit, { flowId })
      .provide([
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), true],
        [select(selectors.getScriptsTiedToFlow, flowId), []],
      ]).put(actions.bottomDrawer.initComplete(
        [
          {label: 'Run console', tabType: 'dashboard'},
          {label: 'Run history', tabType: 'runHistory'},
          {label: 'Connections', tabType: 'connections'},
          {label: 'Audit Log', tabType: 'auditLogs'},
        ]
      ))
      .run());

    test('should trigger initComplete action correctly for flow with scripts', () => expectSaga(
      bottomDrawerInit, { flowId })
      .provide([
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), true],
        [select(selectors.getScriptsTiedToFlow, flowId), [{id: 'i1'}]],
      ]).put(actions.bottomDrawer.initComplete(
        [
          {label: 'Run console', tabType: 'dashboard'},
          {label: 'Run history', tabType: 'runHistory'},
          {label: 'Connections', tabType: 'connections'},
          {label: 'Scripts', tabType: 'scripts'},
          {label: 'Audit Log', tabType: 'auditLogs'},
        ]
      ))
      .run());
  });

  describe('addTab sagas', () => {
    const resourceId = 'r1';

    test('should not do anything in case tabType is not connectionLogs', () => expectSaga(
      addTab, { tabType: 'dashboard' })
      .run());

    test('should start connection debug for 15 mins in case of tabType = connectionLogs', () => expectSaga(
      addTab, { tabType: 'connectionLogs', resourceId })
      .provide([
        [select(selectors.resource, 'connections', resourceId), {_id: 'i1'}],
      ])
      .put(actions.logs.connections.startDebug(resourceId, 15))
      .put(actions.logs.connections.request(resourceId))
      .run());

    test('should not start connection debug in case debug is already set on connection', () => {
      const dateStrAfter15Mins = moment().add(15, 'm').toISOString();

      expectSaga(
        addTab, { tabType: 'connectionLogs', resourceId })
        .provide([
          [select(selectors.resource, 'connections', resourceId), {_id: 'i1', debugDate: dateStrAfter15Mins}],
        ])
        .not.put(actions.logs.connections.startDebug(resourceId, 15))
        .put(actions.logs.connections.request(resourceId))
        .run();
    });

    test('should start connection debug in case debug date is expired', () => {
      const dateStrAfter15Mins = moment().subtract(5, 'm').toISOString();

      expectSaga(
        addTab, { tabType: 'connectionLogs', resourceId })
        .provide([
          [select(selectors.resource, 'connections', resourceId), {_id: 'i1', debugDate: dateStrAfter15Mins}],
        ])
        .put(actions.logs.connections.startDebug(resourceId, 15))
        .put(actions.logs.connections.request(resourceId))
        .run();
    });
  });

  describe('switchTab sagas', () => {
    test('should not do anything in case user tries to switch to current active tab', () => {
      const tabType = 'dashboard';
      const index = undefined;

      expectSaga(
        switchTab, { tabType })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
            ],
            activeTabIndex: 0,
          }],
        ])
        .not.put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });

    test('should dispatch setActiveTab action correctly', () => {
      const tabType = 'dashboard';
      const index = undefined;

      expectSaga(
        switchTab, { tabType })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
            ],
            activeTabIndex: 2,
          }],
        ])
        .put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });

    test('should pause connection debug correctly', () => {
      const tabType = 'dashboard';
      const index = undefined;
      const resourceId = 'c1';

      expectSaga(
        switchTab, { tabType })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
              {label: 'X', tabType: 'connectionLogs', resourceId},
            ],
            activeTabIndex: 3,
          }],
        ])
        .put(actions.logs.connections.pause(resourceId))
        .put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });

    test('should not request connection debug', () => {
      const index = 3;
      const tabType = undefined;
      const resourceId = 'c1';

      expectSaga(
        switchTab, { index })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
              {label: 'X', tabType: 'connectionLogs', resourceId},
            ],
            activeTabIndex: 1,
          }],
          [select(selectors.resource, 'connections', resourceId), {}],
          [select(selectors.allConnectionsLogs), {
            [resourceId]: {

            },
          }],
        ])
        .not.put(actions.logs.connections.request(resourceId))
        .put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });

    test('should request connection debug', () => {
      const index = 3;
      const tabType = undefined;
      const resourceId = 'c1';

      expectSaga(
        switchTab, { index })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
              {label: 'X', tabType: 'connectionLogs', resourceId},
            ],
            activeTabIndex: 1,
          }],
          [select(selectors.resource, 'connections', resourceId), {
            debugDate: moment().add(15, 'm').toISOString(),
          }],
          [select(selectors.allConnectionsLogs), {
            [resourceId]: {
              isPaused: true,
            },
          }],
        ])
        .put(actions.logs.connections.request(resourceId))
        .put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });

    test('should not request connection debug[2]', () => {
      const index = 3;
      const tabType = undefined;
      const resourceId = 'c1';

      expectSaga(
        switchTab, { index })
        .provide([
          [select(selectors.bottomDrawerTabs), {
            tabs: [
              {label: 'Dashboard', tabType: 'dashboard'},
              {label: 'Connections', tabType: 'connections'},
              {label: 'Audit Log', tabType: 'auditLogs'},
              {label: 'X', tabType: 'connectionLogs', resourceId},
            ],
            activeTabIndex: 1,
          }],
          [select(selectors.resource, 'connections', resourceId), {
            debugDate: moment().subtract(15, 'm').toISOString(),
          }],
          [select(selectors.allConnectionsLogs), {
            [resourceId]: {
              isPaused: true,
            },
          }],
        ])
        .not.put(actions.logs.connections.request(resourceId))
        .put(actions.bottomDrawer.setActiveTab({index, tabType}))
        .run();
    });
  });
});
