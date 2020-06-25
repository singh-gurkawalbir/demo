import { call, takeEvery, takeLatest, put, select, all } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import templateUtil from '../../utils/template';
import { getResource } from '../resources';

export function* requestPreview({ resourceType, resourceId }) {
  const path = `/${resourceType}/${resourceId}/clone/preview`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      message: 'Fetching Preview',
    });
  } catch (error) {
    yield put(actions.template.failedPreview(`${resourceType}-${resourceId}`));

    return undefined;
  }

  yield put(
    actions.template.receivedPreview(
      components,
      `${resourceType}-${resourceId}`
    )
  );
}

export function* createComponents({ resourceType, resourceId }) {
  const { cMap: connectionMap, stackId: _stackId, data = {} } = yield select(
    selectors.cloneData,
    resourceType,
    resourceId
  );
  const path = `/${resourceType}/${resourceId}/clone`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: {
          connectionMap,
          _stackId,
          sandbox: data.sandbox,
          name: data.name,
          tag: data.tag,
          _integrationId: data._integrationId,
          newTemplateInstaller: data.newTemplateInstaller,
        },
      },
      message: 'Cloning...',
    });
  } catch (error) {
    yield put(actions.template.failedInstall(`${resourceType}-${resourceId}`));

    return undefined;
  }

  if (data.newTemplateInstaller && components && components._integrationId) {
    yield put(actions.resource.requestCollection('integrations'));
    yield put(actions.resource.requestCollection('tiles'));
    yield put(
      actions.integrationApp.clone.receivedIntegrationClonedStatus(
        resourceId,
        components._integrationId
      )
    );

    return;
  }

  const dependentResources =
    templateUtil.getDependentResources(components) || [];

  yield all(
    dependentResources.map(({ resourceType, id }) =>
      call(getResource, { resourceType, id })
    )
  );
  yield put(
    actions.template.createdComponents(
      components,
      `${resourceType}-${resourceId}`
    )
  );
}

export const cloneSagas = [
  takeEvery(actionTypes.CLONE.PREVIEW_REQUEST, requestPreview),
  takeLatest(actionTypes.CLONE.CREATE_COMPONENTS, createComponents),
];
