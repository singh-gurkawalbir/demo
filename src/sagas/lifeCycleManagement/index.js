import { delay, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
// import { apiCallWithRetry } from '../index';

export function* requestIntegrationCloneFamily({ integrationId }) {
  try {
    // const cloneFamily = yield call(apiCallWithRetry, {
    //   path: `/integrations/${integrationId}/clonefamily`,
    //   opts: {
    //     method: 'GET',
    //   },
    // });
    const cloneFamily = [
      {
        _id: '6203b066887b312cb0811c92',
        name: 'Clone Integration using /clone route',
        sandbox: false,
      },
      {
        _id: '6203c20df06fd655e212980f',
        name: 'Clone - Master Integration',
        sandbox: false,
      },
      {
        _id: '6203f8e896c8fccb83c4cc0e',
        name: 'clone now',
        sandbox: false,
      },
    ];

    yield delay(2000);
    yield put(actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily));
  } catch (error) {
    yield put(actions.integrationLCM.cloneFamily.receivedError(integrationId, error));
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.REQUEST, requestIntegrationCloneFamily),
];
