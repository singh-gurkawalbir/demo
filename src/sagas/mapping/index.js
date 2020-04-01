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
import { adaptorTypeMap } from '../../utils/resource';

export function* saveMappings({ id }) {
  const patch = [];
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
    flowSampleData,
    adaptorType,
    resource,
    netsuiteRecordType,
    subRecordMappingId,
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
    flowSampleData,
    netsuiteRecordType,
  });
  const { _id: resourceId } = resource;
  const mappingPath = mappingUtil.getMappingPath(adaptorType);

  // in case of subRecord mapping, modify the subrecord and return the root mapping object
  if (
    application === adaptorTypeMap.NetSuiteDistributedImport &&
    subRecordMappingId
  ) {
    _mappings = mappingUtil.appendModifiedSubRecordToMapping({
      resource,
      subRecordMappingId,
      subRecordMapping: _mappings,
      subRecordLookups: lookups,
    });
  }

  patch.push({
    op: _mappings ? 'replace' : 'add',
    path: mappingPath,
    value: _mappings,
  });

  if (lookups && !subRecordMappingId) {
    const lookupPath = lookupUtil.getLookupPath(adaptorType);

    patch.push({
      op: lookups ? 'replace' : 'add',
      path: lookupPath,
      value: lookups,
    });
  }

  yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));

  const resp = yield call(commitStagedChanges, {
    resourceType: 'imports',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  if (resp && (resp.error || resp.conflict))
    return yield put(actions.mapping.saveFailed(id));

  yield put(actions.mapping.saveComplete(id));
}

export function* previewMappings({ id }) {
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
    resource,
    flowSampleData,
    subRecordMappingId,
    netsuiteRecordType,
  } = yield select(selectors.mapping, id);
  let resourceCopy = deepClone(resource);
  let _mappings = mappings
    .filter(mapping => !!mapping.generate)
    .map(
      ({ index, key, hardCodedValueTmp, rowIdentifier, ...others }) => others
    );

  _mappings = mappingUtil.generateMappingsForApp({
    mappings: _mappings,
    generateFields,
    appType: application,
    isGroupedSampleData,
    resource,
    netsuiteRecordType,
    subRecordMappingId,
  });

  const { _connectionId } = resourceCopy;
  let path = `/connections/${_connectionId}/mappingPreview`;
  const requestBody = {
    data: flowSampleData,
  };

  if (application === adaptorTypeMap.SalesforceImport) {
    resourceCopy.mapping = _mappings;

    if (lookups) {
      resourceCopy.salesforce.lookups = lookups;
    }
  } else if (application === adaptorTypeMap.NetSuiteDistributedImport) {
    path = `/netsuiteDA/previewImportMappingFields?_connectionId=${_connectionId}`;
    resourceCopy = resourceCopy.netsuite_da;

    // in case of subRecord mapping, modify the subrecord and return the root mapping object
    if (subRecordMappingId) {
      _mappings = mappingUtil.appendModifiedSubRecordToMapping({
        resource: resourceCopy,
        subRecordMappingId,
        subRecordMapping: _mappings,
        subRecordLookups: lookups,
      });
    } else {
      resourceCopy.lookups = lookups;
    }

    resourceCopy.mapping = _mappings;

    requestBody.data = [requestBody.data];
    requestBody.celigo_resource = 'previewImportMappingFields';
  }

  requestBody.importConfig = resourceCopy;

  const opts = {
    method: 'PUT',
    body: requestBody,
  };

  try {
    const preview = yield call(apiCallWithRetry, {
      path,
      opts,
      message: `Fetching Preview Data`,
    });

    if (application === adaptorTypeMap.NetSuiteDistributedImport) {
      if (
        preview &&
        preview.data &&
        preview.data.returnedObjects &&
        preview.data.returnedObjects.mappingErrors &&
        preview.data.returnedObjects.mappingErrors[0] &&
        preview.data.returnedObjects.mappingErrors[0].error
      ) {
        return yield put(actions.mapping.previewFailed(id));
      }
    }

    yield put(actions.mapping.previewReceived(id, preview));
  } catch (e) {
    yield put(actions.mapping.previewFailed(id));
  }
}

export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW_REQUESTED, previewMappings),
];
