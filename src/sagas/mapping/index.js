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
  const updatedResourceObj = yield select(
    selectors.resource,
    'imports',
    resourceId
  );
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

  // delete file/csv/headerRow if present
  if (
    updatedResourceObj &&
    updatedResourceObj.file &&
    updatedResourceObj.file.csv &&
    updatedResourceObj.file.csv.headerRow
  ) {
    const fileCsvObj = updatedResourceObj.file.csv;

    delete fileCsvObj.headerRow;
    patch.push({
      op: 'replace',
      path: '/file/csv',
      value: fileCsvObj,
    });
  }

  // delete file/xlsx/headerRow if present
  if (
    updatedResourceObj &&
    updatedResourceObj.file &&
    updatedResourceObj.file.xlsx &&
    updatedResourceObj.file.xlsx.headerRow
  ) {
    const fileXlsxObj = updatedResourceObj.file.xlsx;

    delete fileXlsxObj.headerRow;
    patch.push({
      op: 'replace',
      path: '/file/xlsx',
      value: fileXlsxObj,
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

export function* previewMappings({ id }) {
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
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

  if (application === adaptorTypeMap.SalesforceImport) {
    resourceCopy.mapping = _mappings;

    if (lookups) {
      resourceCopy.salesforce.lookups = lookups;
    }
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

    yield put(actions.mapping.previewReceived(id, previewData));
  } catch (e) {
    yield put(actions.mapping.previewFailed(id));
  }
}

export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW_REQUESTED, previewMappings),
];
