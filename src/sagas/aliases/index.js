import { call, takeLatest, select, put, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { patchResource } from '../resources';

export function* requestAllAliases({ id, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, id);
  const integrationId = resourceType === 'flows' ? resource?._integrationId : id;
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

export function* createOrUpdateAlias({ id, resourceType, aliasId, isEdit, asyncKey }) {
  const resourceAliases = yield select(selectors.ownAliases, resourceType, id);
  const formVal = yield select(selectors.formValueTrimmed, asyncKey);
  const newAliasId = formVal.aliasId.toLowerCase();            // alias name will always be in lower case characters
  const newAlias = {
    alias: newAliasId,
  };

  if (formVal.description) {
    newAlias.description = formVal.description;
  }
  if (formVal.aliasResourceType === 'connections') {
    newAlias._connectionId = formVal.aliasResourceName;
  } else if (formVal.aliasResourceType === 'exports') {
    newAlias._exportId = formVal.aliasResourceName;
  } else if (formVal.aliasResourceType === 'flows') {
    newAlias._flowId = formVal.aliasResourceName;
  } else {
    newAlias._importId = formVal.aliasResourceName;
  }

  let newResourceAliases;

  if (isEdit) {
    newResourceAliases = resourceAliases.map(aliasData => {
      if (!(aliasData.alias === aliasId)) return aliasData;

      return newAlias;
    });
  } else {
    newResourceAliases = [...resourceAliases, newAlias];
  }

  const patchSet = [
    {
      op: 'replace',
      path: '/aliases',
      value: newResourceAliases,
    },
  ];
  const options = {doNotRefetch: true};
  let response;

  yield put(actions.asyncTask.start(asyncKey));
  try {
    response = yield call(patchResource, { id, resourceType, patchSet, options });
  } catch (e) {
    yield put(actions.asyncTask.failed(asyncKey));

    return;
  }

  if (response?.error) {
    yield put(actions.asyncTask.failed(asyncKey));

    return;
  }

  yield put(actions.resource.aliases.actionStatus(id, newAliasId, isEdit ? 'edit' : 'save'));
  yield put(actions.asyncTask.success(asyncKey));
}

export function* deleteAlias({ id, resourceType, aliasId, asyncKey }) {
  const resourceAliases = yield select(selectors.ownAliases, resourceType, id);
  const patchSet = [
    {
      op: 'replace',
      path: '/aliases',
      value: resourceAliases.filter(aliasData => aliasData.alias !== aliasId),
    },
  ];
  const options = {doNotRefetch: true};
  let response;

  try {
    response = yield call(patchResource, { id, resourceType, patchSet, options, asyncKey });
  } catch (e) {
    return;
  }

  if (!response?.error) {
    yield put(actions.resource.aliases.actionStatus(id, '', 'delete'));
  }
}

export default [
  takeLatest(actionTypes.RESOURCE.REQUEST_ALL_ALIASES, requestAllAliases),
  takeEvery(actionTypes.RESOURCE.CREATE_OR_UPDATE_ALIAS, createOrUpdateAlias),
  takeEvery(actionTypes.RESOURCE.DELETE_ALIAS, deleteAlias),
];
