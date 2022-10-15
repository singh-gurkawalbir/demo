import { call, takeEvery, takeLatest, put, select, all } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import templateUtil from '../../utils/template';
import { getResource } from '../resources';
import { refreshConnectionMetadata } from '../resources/meta';

export function* requestPreview({ resourceType, resourceId }) {
  const path = `/${resourceType}/${resourceId}/clone/preview`;
  let components;

  try {
    components = yield call(apiCallWithRetry, {
      path,
      message: 'Loading',
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
  const { cMap: connectionMap = {}, stackId: _stackId, data = {} } = yield select(
    selectors.template,
    `${resourceType}-${resourceId}`
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
          _flowGroupingId: data._flowGroupingId,
          newTemplateInstaller: data.newTemplateInstaller,
        },
      },
      message: 'Cloning...',
    });
  } catch (error) {
    yield put(actions.template.failedInstall(`${resourceType}-${resourceId}`));
    if (data.newTemplateInstaller) {
      yield put(
        actions.integrationApp.clone.receivedIntegrationClonedStatus(
          resourceId,
          '',
          error
        )
      );
    }

    return undefined;
  }

  if (data.newTemplateInstaller && components && components._integrationId) {
    yield put(actions.resource.requestCollection('integrations'));
    yield put(actions.resource.requestCollection('tiles'));
    yield put(
      actions.integrationApp.clone.receivedIntegrationClonedStatus(
        resourceId,
        components._integrationId,
        '',
        data.sandbox,
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

  if (resourceType === 'flows') {
    // Incase of flow cloning - refresh NS/SF connection's metadata @Enhancement IO-12915
    const connectionIds = Object.values(connectionMap);
    const connectionObjs = yield all(connectionIds.map(id => select(selectors.resource, 'connections', id)));
    const connections = connectionObjs
      .filter(c => ['netsuite', 'salesforce'].includes(c.type))
      .map(c => ({ type: c.type, _id: c._id }));

    yield call(refreshConnectionMetadata, { connections });
  }
}

export const cloneSagas = [
  takeEvery(actionTypes.CLONE.PREVIEW_REQUEST, requestPreview),
  takeLatest(actionTypes.CLONE.CREATE_COMPONENTS, createComponents),
];
