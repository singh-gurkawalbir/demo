import { put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import {selectors} from '../../reducers';

export function* bottomDrawerInit({flowId}) {
  const isUserInErrMgtTwoDotZero = yield select(selectors.isOwnerUserInErrMgtTwoDotZero);
  const flowScripts = yield select(selectors.mkGetScriptsTiedToFlow(), flowId);
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

  if (lastActiveTab.tabType === 'connectionLogs') {
    // when user is switching away from connection log tab
    const { resourceId: connectionId } = lastActiveTab;

    const connection = yield select(selectors.resource, 'connections', connectionId);

    const { debugDate } = connection || {};

    if (moment().isBefore(moment(debugDate))) {
      yield put(actions.logs.connections.stop(connectionId));
    }
  } else if (requestedTab.tabType === 'connectionLogs') {
    // when user switches to connection log tab
    const {resourceId: connectionId} = requestedTab;
    const connectionLogState = yield select(selectors.allConnectionsLogs);

    const connectionLogStatus = connectionLogState?.[connectionId]?.status;
    const connection = yield select(selectors.resource, 'connections', connectionId);
    const { debugDate } = connection || {};

    // check if connection log is in paused state
    if (connectionLogStatus === 'stopped' && moment().isBefore(moment(debugDate))) {
      yield put(actions.logs.connections.request(connectionId));
    }
  }

  yield put(actions.bottomDrawer.setActiveTab({index, tabType}));
}

export const bottomDrawerSagas = [
  takeLatest(actionTypes.BOTTOM_DRAWER.INIT, bottomDrawerInit),
  takeLatest(actionTypes.BOTTOM_DRAWER.SWITCH_TAB, switchTab),
];
