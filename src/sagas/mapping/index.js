import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import shortid from 'shortid';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import {selectors} from '../../reducers';
import { commitStagedChanges } from '../resources';
import mappingUtil from '../../utils/mapping';
import lookupUtil from '../../utils/lookup';
import { apiCallWithRetry } from '..';
import { getResourceSubType} from '../../utils/resource';
import { getImportOperationDetails } from '../../utils/assistant';
import {requestSampleData as requestFlowSampleData} from '../sampleData/flows';
import {requestSampleData as requestImportSampleData} from '../sampleData/imports';
import {requestAssistantMetadata} from '../resources/meta';
import {getMappingMetadata as getIAMappingMetadata} from '../integrationApps/settings';

export function* loadRequiredData({
  flowId,
  resourceId,
  subRecordMappingId,
}) {
  const importRes = yield select(selectors.resource, 'imports', resourceId);

  /**  request for flow sample data */
  yield call(requestFlowSampleData, {
    flowId,
    resourceId,
    resourceType: 'imports',
    stage: 'importMappingExtract',
  });

  // see for its refactor
  const subRecordMappingObj = subRecordMappingId
    ? mappingUtil.getSubRecordRecordTypeAndJsonPath(importRes, subRecordMappingId) : {};

  yield call(requestImportSampleData, {
    resourceId,
    options: subRecordMappingObj,
  });

  if (importRes.assistant && importRes.assistant !== 'financialforce') {
    /** request for assistant metadata
    * financialforce is special assistant newly added and it doesnt behave like other assistant
    */
    const {assistant, type: adaptorType} = importRes;

    yield call(requestAssistantMetadata, {
      adaptorType,
      assistant,
    });
  }

  if (importRes._connectorId) {
    /** request for IA metadata */
    const {_integrationId: integrationId} = importRes;

    yield call(getIAMappingMetadata, {
      integrationId,
    });
  }
}

export function* mappingInit({
  flowId,
  resourceId,
  subRecordMappingId,
}) {
  /** fetch sample data */
  yield call(loadRequiredData, {
    flowId,
    resourceId,
    subRecordMappingId,
  });
  //   yield delay(500);
  const importRes = yield select(selectors.resource, 'imports', resourceId);
  const exportRes = yield select(selectors.flowPageGenerator, flowId);
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = !!(flowSampleData && Array.isArray(flowSampleData));
  let formattedMappings = [];
  let lookups = [];

  const options = {};

  if (importRes.netsuite_da) {
    const recordType = yield select(selectors.mappingNSRecordType, resourceId, subRecordMappingId);

    options.recordType = recordType;
  }
  if (importRes._connectorId) {
    const { _integrationId } = importRes;

    const { mappingMetadata } = yield select(
      selectors.integrationAppMappingMetadata,
      _integrationId
    );

    options.integrationApp = {
      mappingMetadata,
    };
  } else if (importRes.assistant) {
    const { assistantMetadata } = importRes;
    const { operation, resource, version } = assistantMetadata;
    const { adaptorType, assistant } = getResourceSubType(
      resource
    );
    const assistantData = yield select(
      selectors.assistantData,
      adaptorType,
      assistant
    );
    const { requiredMappings } = getImportOperationDetails({
      operation,
      resource,
      version,
      assistantData,
    });

    options.assistant = { requiredMappings };
  }
  if (subRecordMappingId) {
    const {
      mappings: subRecordMapping,
      lookups: subrecordLookups = [],
    } = mappingUtil.generateSubrecordMappingAndLookup(
      importRes,
      subRecordMappingId,
      isGroupedSampleData,
      options
    );

    formattedMappings = subRecordMapping;
    lookups = subrecordLookups;
  } else {
    formattedMappings = mappingUtil.getMappingFromResource(
      importRes,
      false,
      isGroupedSampleData,
      options.recordType,
      options,
      exportRes
    );
    lookups = lookupUtil.getLookupFromResource(importRes) || [];
  }
  yield put(
    actions.mapping.initComplete({
      mappings: formattedMappings.map(m => ({
        ...m,
        rowIdentifier: 0,
        key: shortid.generate(),
      })),
      lookups,
      flowId,
      resourceId,
      subRecordMappingId,
      recordType: options.recordType,
      isCsvOrXlsxResource: mappingUtil.isCsvOrXlsxResource(importRes),
    })
  );

  // TODO
  // yield call(refreshGenerates, {id, isInit: true });
}

export function* saveMappings({context }) {
  const patch = [];
  const {
    mappings,
    lookups,
    resourceId,
    flowId,
    recordType,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, resourceId);
  const importRes = yield select(selectors.resource, 'imports', resourceId);
  const exportRes = yield select(selectors.flowPageGenerator, flowId);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, key, rowIdentifier, ...others }) => others
  );
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = !!(flowSampleData && Array.isArray(flowSampleData));

  _mappings = mappingUtil.generateFieldsAndListMappingForApp({
    mappings: _mappings,
    generateFields,
    isGroupedSampleData,
    importRes,
    netsuiteRecordType: recordType,
    exportRes,
  });
  const mappingPath = mappingUtil.getMappingPath(importRes.adaptorType);

  // in case of subRecord mapping, modify the subrecord and return the root mapping object
  if (
    ['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importRes.adaptorType) &&
    subRecordMappingId
  ) {
    _mappings = mappingUtil.appendModifiedSubRecordToMapping({
      resource: importRes,
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
    const lookupPath = lookupUtil.getLookupPath(importRes.adaptorType);

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
    context,
  });

  if (resp && (resp.error || resp.conflict)) return yield put(actions.mapping.saveFailed());

  yield put(actions.mapping.saveComplete());
}

export function* previewMappings() {
  const {
    mappings,
    lookups,
    resourceId,
    flowId,
    subRecordMappingId,
    recordType,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, resourceId);
  const _importRes = yield select(selectors.resource, 'imports', resourceId);
  let importRes = deepClone(_importRes);
  const exportRes = yield select(selectors.flowPageGenerator, flowId);
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = !!(flowSampleData && Array.isArray(flowSampleData));
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, key, rowIdentifier, ...others }) => others
  );

  _mappings = mappingUtil.generateFieldsAndListMappingForApp({
    mappings: _mappings,
    generateFields,
    isGroupedSampleData,
    importRes,
    netsuiteRecordType: recordType,
    exportRes,
  });

  const { _connectionId } = importRes;
  let path = `/connections/${_connectionId}/mappingPreview`;
  const requestBody = {
    data: flowSampleData,
  };

  if (importRes.adaptorType === 'SalesforceImport') {
    importRes.mapping = _mappings;

    if (lookups) {
      importRes.salesforce.lookups = lookups;
    }
  } else if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importRes.adaptorType)) {
    path = `/netsuiteDA/previewImportMappingFields?_connectionId=${_connectionId}`;

    // in case of subRecord mapping, modify the subrecord and return the root mapping object
    if (subRecordMappingId) {
      _mappings = mappingUtil.appendModifiedSubRecordToMapping({
        resource: importRes,
        subRecordMappingId,
        subRecordMapping: _mappings,
        subRecordLookups: lookups,
      });
    }

    importRes = importRes.netsuite_da;

    if (!subRecordMappingId) {
      importRes.lookups = lookups;
    }

    importRes.mapping = _mappings;
    requestBody.data = [requestBody.data];
    requestBody.celigo_resource = 'previewImportMappingFields';
  } else if (importRes.adaptorType === 'HTTPImport') {
    importRes.mapping = _mappings;

    if (lookups) importRes.http.lookups = lookups;
  }

  requestBody.importConfig = importRes;

  const opts = {
    method: 'PUT',
    body: requestBody,
  };

  try {
    const preview = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Loading',
    });

    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importRes.adaptorType)) {
      if (
        preview &&
        preview.data &&
        preview.data.returnedObjects &&
        preview.data.returnedObjects.mappingErrors &&
        preview.data.returnedObjects.mappingErrors[0] &&
        preview.data.returnedObjects.mappingErrors[0].error
      ) {
        return yield put(actions.mapping.previewFailed());
      }
    }

    yield put(actions.mapping.previewReceived(preview));
  } catch (e) {
    yield put(actions.mapping.previewFailed());
  }
}
export function* refreshGenerates({ isInit = false }) {
  const {
    mappings,
    resourceId,
    netsuiteRecordType,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, resourceId);
  const importRes = yield select(selectors.resource, 'imports', resourceId);

  if (importRes.adaptorType === 'SalesforceImport') {
    // salesforce Import could have sub objects as well
    const { _connectionId, salesforce } = importRes;
    const { sObjectType } = salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: _connectionId,
        commMetaPath: `salesforce/metadata/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    // during init, parent sObject metadata is already fetched.
    const sObjectList = isInit ? [] : [sObjectType];

    // check for each mapping sublist if it relates to childSObject
    generateFields.forEach(({id}) => {
      if (id.indexOf('[*].') !== -1) {
        const childObjectName = id.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === childObjectName);

        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    // check for child sObject in mappings.
    mappings.forEach(({generate}) => {
      if (generate && generate.indexOf('[*].') !== -1) {
        const subListName = generate.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === subListName);

        if (childRelationshipObject && sObjectList.indexOf(childRelationshipObject?.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    yield put(actions.importSampleData.request(
      resourceId,
      {sObjects: sObjectList},
      !isInit
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    const opts = {};

    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importRes.adaptorType) && subRecordMappingId) {
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

export function* checkForIncompleteSFGenerateWhilePatch({ id, field, value = '' }) {
  if (value.indexOf('_child_') === -1) {
    return;
  }
  const {
    mappings,
    resourceId,
  } = yield select(selectors.mapping);
  const importRes = yield select(selectors.resource, 'imports', resourceId);

  if (importRes.adaptorType !== 'SalesforceImport' || field !== 'generate') {
    return;
  }
  const generateFields = yield select(selectors.mappingGenerates, resourceId);

  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj;
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
    ));
  }
}
export function* updateImportSampleData() {
  // identify sample data change
  const {
    incompleteGenerates = [],
    mappings = [],
    resourceId,
  } = yield select(selectors.mapping);

  if (!incompleteGenerates.length) return;

  const generateFields = yield select(selectors.mappingGenerates, resourceId);
  const modifiedMappings = deepClone(mappings);

  incompleteGenerates.forEach(generateObj => {
    const {
      value: incompleteGenValue,
      key: incompleteGenKey,
    } = generateObj;
    const incompleteGenIndex = modifiedMappings.findIndex(
      m => m.key === incompleteGenKey
    );
    const childSObject =
      generateFields &&
      generateFields.find(
        field => field.id.indexOf(`${incompleteGenValue}[*].`) > -1
      );

    if (childSObject) {
      const objCopy = { ...modifiedMappings[incompleteGenIndex] };

      objCopy.generate = childSObject.id;
      objCopy.rowIdentifier += 1;
      modifiedMappings[incompleteGenIndex] = objCopy;
    }
  });

  yield put(actions.mapping.updateMappings(modifiedMappings));
}

export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW_REQUESTED, previewMappings),
  takeLatest(actionTypes.MAPPING.REFRESH_GENERATES, refreshGenerates),
  takeLatest(actionTypes.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),

];
