import { put, select, takeLatest } from 'redux-saga/effects';
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

export const bottomDrawerSagas = [
  takeLatest(actionTypes.BOTTOM_DRAWER.INIT, bottomDrawerInit),
];
