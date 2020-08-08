import { call, takeEvery, put, select, all } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import templateUtil from '../../utils/template';
import { getResource } from '../resources';

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
      message: 'Loading',
    });
  } catch (error) {
    yield put(actions.template.failedPreview(templateId));

    return undefined;
  }

  yield put(actions.template.receivedPreview(components, templateId));
}

export function* createComponents({ templateId, runKey }) {
  const { cMap: connectionMap, stackId: _stackId } = yield select(
    selectors.templateSetup,
    templateId
  );
  const template = yield select(selectors.marketplaceTemplate, { templateId });
  const userPreferences = yield select(selectors.userPreferences);
  const sandbox = userPreferences.environment === 'sandbox';
  const path = `/integrations/template${runKey ? '' : `/${templateId}`}`;
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
          runKey,
          name: `Copy ${(template || {}).name}`,
        },
      },
      message: 'Installing Template...',
    });
  } catch (error) {
    yield put(actions.template.failedInstall(templateId));

    return undefined;
  }

  const dependentResources =
    templateUtil.getDependentResources(components) || [];

  yield all(
    dependentResources.map(({ resourceType, id }) =>
      call(getResource, { resourceType, id })
    )
  );
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
      message: 'Verifying Bundle/Package Installation...',
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

  if (response && response.success) {
    yield put(
      actions.template.updateStep(
        { status: 'completed', installURL: step.installURL },
        templateId
      )
    );
  } else {
    if (
      response &&
      !response.success &&
      (response.resBody || response.message)
    ) {
      yield put(
        actions.api.failure(
          path,
          'GET',
          response.resBody || response.message,
          false
        )
      );
    }

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
  takeEvery(actionTypes.TEMPLATE.PREVIEW_REQUEST, requestPreview),
  takeEvery(
    actionTypes.TEMPLATE.VERIFY_BUNDLE_INSTALL,
    verifyBundleOrPackageInstall
  ),
  takeEvery(actionTypes.TEMPLATE.CREATE_COMPONENTS, createComponents),
];
