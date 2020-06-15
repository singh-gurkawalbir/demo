import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import mappingUtil from '../../utils/mapping';
import lookupUtil from '../../utils/lookup';
import { apiCallWithRetry } from '..';
import { adaptorTypeMap } from '../../utils/resource';

export function* saveMappings({ id }) {
  const patch = [];
  const {
    mappings,
    application,
    isGroupedSampleData,
    lookups,
    flowSampleData,
    adaptorType,
    resource,
    importSampleData,
    netsuiteRecordType,
    subRecordMappingId,
  } = yield select(selectors.mapping, id);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
  );
  const generateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
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

    // TODO: temporary fix Remove check once backend adds lookup support for Snowflake.
    if (lookupPath) {
      patch.push({
        op: lookups ? 'replace' : 'add',
        path: lookupPath,
        value: lookups,
      });
    }
  }

  yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));

  const resp = yield call(commitStagedChanges, {
    resourceType: 'imports',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  if (resp && (resp.error || resp.conflict)) return yield put(actions.mapping.saveFailed(id));

  yield put(actions.mapping.saveComplete(id));
}

export function* previewMappings({ id }) {
  const {
    mappings,
    application,
    importSampleData,
    isGroupedSampleData,
    lookups,
    resource,
    flowSampleData,
    subRecordMappingId,
    netsuiteRecordType,
  } = yield select(selectors.mapping, id);
  const generateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
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

    // in case of subRecord mapping, modify the subrecord and return the root mapping object
    if (subRecordMappingId) {
      _mappings = mappingUtil.appendModifiedSubRecordToMapping({
        resource: resourceCopy,
        subRecordMappingId,
        subRecordMapping: _mappings,
        subRecordLookups: lookups,
      });
    }

    resourceCopy = resourceCopy.netsuite_da;

    if (!subRecordMappingId) {
      resourceCopy.lookups = lookups;
    }

    resourceCopy.mapping = _mappings;
    requestBody.data = [requestBody.data];
    requestBody.celigo_resource = 'previewImportMappingFields';
  } else if (application === adaptorTypeMap.HTTPImport) {
    resourceCopy.mapping = _mappings;

    if (lookups) resourceCopy.http.lookups = lookups;
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
      message: 'Fetching preview data',
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
export function* refreshGenerates({ id, isInit = false }) {
  const {
    application,
    mappings = [],
    resource = {},
    importSampleData,
    subRecordMappingId,
    netsuiteRecordType,
  } = yield select(selectors.mapping, id);
  const generateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
  const { _id: resourceId, } = resource
  if (application === adaptorTypeMap.SalesforceImport) {
    // salesforce Import could have sub objects as well
    const { _connectionId, salesforce } = resource
    const { sObjectType } = salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: _connectionId,
        commMetaPath: `salesforce/metadata/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      })
    // during init, parent sObject metadata is already fetched.
    const sObjectList = isInit ? [] : [sObjectType];
    // check for each mapping sublist if it relates to childSObject
    generateFields.forEach(({id}) => {
      if (id.indexOf('[*].') !== -1) {
        const childObjectName = id.split('[*].')[0]
        const childRelationshipObject = childRelationshipFields.find(field => field.value === childObjectName)
        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject)
        }
      }
    })
    // check for child sObject in mappings.
    mappings.forEach(({generate}) => {
      if (generate && generate.indexOf('[*].') !== -1) {
        const subListName = generate.split('[*].')[0]
        const childRelationshipObject = childRelationshipFields.find(field => field.value === subListName)
        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject)
        }
      }
    })
    yield put(actions.importSampleData.request(
      resourceId,
      {sObjects: sObjectList},
      !isInit
    ))
    // in case of salesforce import, fetch all child sObject reference
  } else {
    const opts = {};
    if (application === adaptorTypeMap.NetSuiteImport && subRecordMappingId) {
      opts.recordType = netsuiteRecordType;
    }
    yield put(actions.importSampleData.request(
      resourceId,
      opts,
      !isInit
    )
    );
  }
}


export function* mappingInit({ id }) {
  const {
    application,
  } = yield select(selectors.mapping, id);
  if (application !== adaptorTypeMap.SalesforceImport) {
    return;
  }
  // load all sObjects used in mapping list
  yield call(refreshGenerates, {id, isInit: true })
}
export function* checkForIncompleteSFGenerateWhilePatch({ id, field, value = '' }) {
  if (value.indexOf('_child_') === -1) {
    return;
  }
  const {
    resource,
    application,
    importSampleData,
    mappings = [],
  } = yield select(selectors.mapping, id);
  const {_id: resourceId} = resource;
  if (application !== adaptorTypeMap.SalesforceImport || field !== 'generate') {
    return;
  }
  const generateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj
  const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);
  if (childRelationshipField && childRelationshipField.childSObject) {
    const { childSObject, relationshipName } = childRelationshipField;

    yield put(actions.mapping.patchIncompleteGenerates(
      id,
      key,
      relationshipName
    )
    );
    yield put(actions.importSampleData.request(
      resourceId,
      {sObjects: [childSObject]}
    ))
  }
}
export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW_REQUESTED, previewMappings),
  takeLatest(actionTypes.MAPPING.REFRESH_GENERATES, refreshGenerates),
  takeLatest(actionTypes.MAPPING.INIT, mappingInit),
  takeLatest(actionTypes.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),

];
