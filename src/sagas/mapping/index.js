import { call, takeEvery, put, select } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import mappingUtil from '../../utils/mapping';
import lookupUtil from '../../utils/lookup';
import { apiCallWithRetry } from '../';

export function* saveMappings({ id }) {
  const patch = [];
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
    adaptorType,
    resource,
  } = yield select(selectors.mapping, id);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
  );

  _mappings = mappingUtil.generateMappingsForApp({
    mappings: _mappings,
    generateFields,
    appType: application,
    isGroupedSampleData,
    resource,
  });
  const { _id: resourceId } = resource;
  const mappingPath = mappingUtil.getMappingPath(adaptorType);

  patch.push({
    op: _mappings ? 'replace' : 'add',
    path: mappingPath,
    value: _mappings,
  });

  if (lookups) {
    const lookupPath = lookupUtil.getLookupPath(adaptorType);

    patch.push({
      op: lookups ? 'replace' : 'add',
      path: lookupPath,
      value: lookups,
    });
  }

  yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));

  const error = yield call(commitStagedChanges, {
    resourceType: 'imports',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  if (error) return yield put(actions.mapping.saveFailed(id));

  yield put(actions.mapping.saveComplete(id));
}

export function* mappingPreview({ id }) {
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
    // adaptorType,
    resource,
    flowSampleData,
  } = yield select(selectors.mapping, id);
  const resourceCopy = deepClone(resource);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
  );

  _mappings = mappingUtil.generateMappingsForApp({
    mappings: _mappings,
    generateFields,
    appType: application,
    isGroupedSampleData,
    resource,
  });

  resourceCopy.mapping = _mappings;

  if (lookups) {
    resourceCopy.salesforce.lookups = lookups;
  }

  const { _connectionId } = resourceCopy;
  const path = `/connections/${_connectionId}/mappingPreview`;
  const opts = {
    method: 'PUT',
    body: {
      data: flowSampleData,
      importConfig: resourceCopy,
    },
  };

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts,
      message: `Fetching Preview Data`,
    });

    yield put(actions.mapping.receivedPreview(id, previewData));
  } catch (e) {
    yield put(actions.mapping.failedPreview(id));
  }
}

export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW, mappingPreview),
];
