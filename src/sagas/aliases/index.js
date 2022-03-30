import { call, takeLatest, select, put, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { patchResource, requestReferences } from '../resources';
import { getResourceFromAlias } from '../../utils/resource';

export function* requestAllAliases({ id, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, id);
  const integrationId = resourceType === 'flows' ? resource._integrationId : id;
  let path;

  if (resourceType === 'integrations') {
    path = `/integrations/${integrationId}/aliases`;
  } else {
    path = `/integrations/${integrationId}/flows/${id}/aliases`;
  }

  try {
    let response = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'GET' },
      message: 'Requesting aliases',
    });

    if (response !== undefined && !Array.isArray(response)) {
      response = undefined;
    }

    yield put(actions.resource.aliases.received(id, response));
  } catch (e) {
    // do nothing
  }
}

export function* deleteAlias({ id, resourceType, aliasId, asyncKey }) {
  const resourceAliases = yield select(selectors.ownAliases, resourceType, id);
  const aliasData = resourceAliases.find(ra => ra.alias === aliasId);
  const { resourceType: aliasResourceType, id: aliasResourceId } = getResourceFromAlias(aliasData);

  const patchSet = [
    {
      op: 'replace',
      path: '/aliases',
      value: resourceAliases.filter(aliasData => aliasData.alias !== aliasId),
    },
  ];

  try {
    const resourceReferences = yield call(requestReferences, {
      resourceType: aliasResourceType,
      id: aliasResourceId,
    });

    if (resourceReferences && Object.keys(resourceReferences).length) {
      return;
    }

    yield call(patchResource, { id, resourceType, patchSet, asyncKey });
  } catch (e) {
    // do nothing
  }
}

export default [
  takeLatest(actionTypes.RESOURCE.REQUEST_ALL_ALIASES, requestAllAliases),
  takeEvery(actionTypes.RESOURCE.DELETE_ALIAS, deleteAlias),
];
