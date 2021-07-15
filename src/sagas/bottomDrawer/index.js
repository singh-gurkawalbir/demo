import { put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import {selectors} from '../../reducers';
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '..';

export function* bottomDrawerInit({flowId}) {
  const isUserInErrMgtTwoDotZero = yield select(selectors.isOwnerUserInErrMgtTwoDotZero);
  const flowScripts = yield select(selectors.getScriptsTiedToFlow, flowId);
  const tabs = [
    {label: isUserInErrMgtTwoDotZero ? 'Run console' : 'Dashboard', tabType: 'dashboard'},
  ];

  if (isUserInErrMgtTwoDotZero) {
    tabs.push({label: 'Run history', tabType: 'runHistory'});
  }
  tabs.push({label: 'Connections', tabType: 'connections'});
  if (flowScripts?.length) {
    tabs.push({label: 'Scripts', tabType: 'scripts'});
  }
  tabs.push({label: 'Audit Log', tabType: 'auditLogs'});

  return yield put(actions.bottomDrawer.initComplete(tabs));
}

export function* addTab({tabType, resourceId}) {
  if (tabType === 'connectionLogs') {
    const {debugDate} = (yield select(selectors.resource, 'connections', resourceId)) || {};

    if (!debugDate || moment().isAfter(moment(debugDate))) {
      yield put(actions.logs.connections.startDebug(resourceId, 15));
    }
    yield put(actions.logs.connections.request(resourceId));
  }
}
export function* switchTab({index, tabType}) {
  const {tabs, activeTabIndex} = yield select(selectors.bottomDrawerTabs);
  const lastActiveTab = tabs?.[activeTabIndex];
  const requestedTab = tabs?.find((tab, ind) => {
    if (tabType) {
      return tab.tabType === tabType;
    }

    return ind === index;
  });

  if (lastActiveTab.tabType === requestedTab.tabType) {
    return;
  }

  if (requestedTab.tabType === 'connectionLogs') {
    // when user switches to connection log tab
    const {resourceId: connectionId} = requestedTab;
    const connectionLogState = yield select(selectors.allConnectionsLogs);

    const isPollingPaused = connectionLogState?.[connectionId]?.isPaused;
    const connection = yield select(selectors.resource, 'connections', connectionId);
    const { debugDate } = connection || {};

    if (isPollingPaused && moment().isBefore(moment(debugDate))) {
      // check if connection log is in paused state
      yield put(actions.logs.connections.request(connectionId));
    }
  } else if (lastActiveTab.tabType === 'connectionLogs') {
    // when user is switching away from connection log tab
    const { resourceId: connectionId } = lastActiveTab;

    yield put(actions.logs.connections.pause(connectionId));
  }

  yield put(actions.bottomDrawer.setActiveTab({index, tabType}));
}

export const bottomDrawerSagas = [
  takeLatest(actionTypes.BOTTOM_DRAWER.INIT, bottomDrawerInit),
  takeLatest(actionTypes.BOTTOM_DRAWER.SWITCH_TAB, switchTab),
  takeLatest(actionTypes.BOTTOM_DRAWER.ADD_TAB, addTab),
];
