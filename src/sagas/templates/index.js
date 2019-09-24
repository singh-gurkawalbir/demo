import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestPreview({ templateId }) {
  const path = `/templates/${templateId}/preview`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      message: `Fetching Preview`,
    });
  } catch (error) {
    yield put(actions.template.failedPreview(templateId));

    return undefined;
  }

  yield put(actions.template.receivedPreview(components, templateId));
}

export default [takeLatest(actionTypes.TEMPLATE.PREVIEW, requestPreview)];
