import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';

export function* requestPreview({ resourceType, resourceId }) {
  const path = `/${resourceType}/${resourceId}/clone/preview`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      message: `Fetching Preview`,
    });
  } catch (error) {
    yield put(actions.clone.failedPreview(resourceType, resourceId));

    return undefined;
  }

  yield put(
    actions.clone.receivedPreview(components, resourceType, resourceId)
  );
}

export function* createComponents({ templateId }) {
  const { cMap: connectionMap, stackId: _stackId } = yield select(
    selectors.templateSetup,
    templateId
  );
  const template = yield select(selectors.marketplaceTemplate, { templateId });
  const userPreferences = yield select(selectors.userPreferences);
  const sandbox = userPreferences.environment === 'sandbox';
  const path = `/integrations/template/${templateId}`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: {
          connectionMap,
          _stackId,
          sandbox,
          name: `Copy ${(template || {}).name}`,
        },
      },
      message: `Installing Template...`,
    });
  } catch (error) {
    yield put(actions.template.failedInstall(templateId));

    return undefined;
  }

  yield put(actions.template.createdComponents(components, templateId));
}

export function* verifyBundleOrPackageInstall({
  step,
  connection,
  templateId,
}) {
  const path = `/connections/${connection._id}/distributed`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: `Verifying Bundle/Package Installation...`,
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

export const cloneSagas = [
  takeEvery(actionTypes.CLONE.PREVIEW_REQUEST, requestPreview),
  takeEvery(
    actionTypes.CLONE.VERIFY_BUNDLE_INSTALL,
    verifyBundleOrPackageInstall
  ),
  takeEvery(actionTypes.CLONE.CREATE_COMPONENTS, createComponents),
];
