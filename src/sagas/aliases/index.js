import { call, takeLatest, select, put, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { patchResource, requestReferences } from '../resources';
import { getResourceFromAlias } from '../../utils/resource';

export function* requestAllAliases({ resourceId, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);
  const integrationId = resourceType === 'flows' ? resource._integrationId : resourceId;
  let path;

  if (resourceType === 'integrations') {
    path = `/integrations/${integrationId}/aliases`;
  } else {
    path = `/integrations/${integrationId}/flows/${resourceId}/aliases`;
  }

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      message: 'Requesting aliases',
    });

    put(actions.resource.aliases.received(resourceId, response));
  } catch (error) {
    return undefined;
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
  } catch (error) {
    return undefined;
  }
}

export default [
  takeLatest(actionTypes.RESOURCE.REQUEST_ALL_ALIASES, requestAllAliases),
  takeEvery(actionTypes.RESOURCE.DELETE_ALIAS, deleteAlias),
];
