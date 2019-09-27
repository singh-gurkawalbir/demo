import { call, takeEvery, put, takeLatest } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';

export function* generateZip({ integrationId }) {
  const path = `/integrations/${integrationId}/template`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Generating zip',
    });
  } catch (e) {
    return;
  }

  window.open(response.signedURL, 'target=_blank', response.options, false);
}

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

export function* verifyBundleInstall({ step, connection, templateId }) {
  const path = `/connections/${connection._id}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: `Fetching Preview`,
    });
  } catch (error) {
    yield put(
      actions.template.updateStep(
        { status: 'failed', installURL: step.installURL },
        templateId
      )
    );

    return undefined;
  }

  if ((response || {}).success) {
    yield put(
      actions.template.updateStep(
        { status: 'completed', installURL: step.installURL },
        templateId
      )
    );
  } else {
    yield put(
      actions.template.updateStep(
        { status: 'failed', installURL: step.installURL },
        templateId
      )
    );
  }
}

export const templateSagas = [
  takeEvery(actionTypes.TEMPLATE.ZIP_GENERATE, generateZip),
  takeEvery(actionTypes.TEMPLATE.PREVIEW, requestPreview),
  takeLatest(actionTypes.TEMPLATE.VERIFY_BUNDLE_INSTALL, verifyBundleInstall),
];
