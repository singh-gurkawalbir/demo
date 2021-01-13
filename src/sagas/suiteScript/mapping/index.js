import { takeEvery, put, select, call, takeLatest, take, race, all } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { commitStagedChanges } from '../resources';
import generateFieldAndListMappings, { updateMappingConfigs, validateMappings } from '../../../utils/suiteScript/mapping';
import { SCOPES } from '../resourceForm';
import {requestSampleData as requestImportSampleData} from '../sampleData/imports';
import {requestFlowSampleData} from '../sampleData/flow';
// check do we need to load if sample data already loaded
export function* fetchRequiredMappingData({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  subRecordMappingId,
}) {
  const {recordType: subRecordType} = yield select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});
  const {status: importSampleDataStatus} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

  // const {status: flowSampleDataStatus} = yield select(selectors.suiteScriptExtracts, {ssLinkedConnectionId, integrationId, flowId});
  // we are fetching flow sample data each time. is it correct. In case we are not emptying the state after change, this needs to change
  yield all([
    call(requestFlowSampleData, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
    }),
    importSampleDataStatus !== 'received' && call(requestImportSampleData, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      options: {recordType: subRecordType},
    }),
  ]);
}
export function* refreshGenerates({ isInit = false }) {
  const {
    mappings = [],
    ssLinkedConnectionId,
    integrationId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMapping);

  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );

  if (!flow) { return; }
  const { import: importRes } = flow;

  if (!importRes) { return; }
  const {type: importType, _connectionId} = importRes;

  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields = [] } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    let sObjectList = [];

    // in some configuration sObjectType not defined
    if (sObjectType) {
      sObjectList.push(sObjectType);
    }

    // check for each mapping sublist if it relates to childSObject
    generateFields.forEach(({id}) => {
      if (id.indexOf('[*].') !== -1) {
        const childObjectName = id.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === childObjectName);

        if (!childRelationshipObject) { return; }

        if (!sObjectList.includes(childRelationshipObject.childSObject)) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    // check for child sObject in mappings.
    mappings.forEach(({generate}) => {
      if (generate && generate.indexOf('[*].') !== -1) {
        const subListName = generate.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === subListName);

        if (!childRelationshipObject) { return; }
        if (!sObjectList.includes(childRelationshipObject.childSObject)) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    if (isInit && sObjectType) {
      // during init, parent sObject metadata is already fetched.
      sObjectList = sObjectList.filter(sObject => sObject !== sObjectType);
    }
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          sObjects: sObjectList,
        },
      }
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    const opts = {
      refreshCache: !isInit,
    };

    if (subRecordMappingId) {
      const netsuiteSubrecordObj = yield select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

      opts.recordType = netsuiteSubrecordObj.recordType;
    }
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: opts,
      }
    )
    );
  }
}

export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId, subRecordMappingId }) {
  /** fetch sample data required to load read mapping */
  const { cancelInit } = yield race({
    fetchData: call(fetchRequiredMappingData, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      subRecordMappingId,
    }),
    cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
  });

  // return in case user closes the mapping or does logout/any similar action
  if (cancelInit) return;

  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );

  if (!flow) {
    return yield put(actions.suiteScript.mapping.initFailed());
  }

  const {export: exportResource, import: importResource} = flow;
  const {type: importType} = importResource;

  let exportType;

  if (exportResource.netsuite && ['restlet', 'batch', 'realtime'].includes(exportResource.netsuite.type)) {
    exportType = 'netsuite';
  } else {
    exportType = exportResource.type;
  }
  const options = {
    importType,
    exportType,
    connectionId: exportResource._connectionId,
    subRecordMappingId,
  };
  let mapping;
  let lookups;

  if (importType === 'netsuite') {
    if (subRecordMappingId) {
      const netsuiteSubrecordObj = yield select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

      options.recordType = netsuiteSubrecordObj.recordType;
      mapping = netsuiteSubrecordObj.mapping;
      lookups = netsuiteSubrecordObj.lookups;
    } else {
      options.recordType = importResource.netsuite.recordType;
      mapping = importResource.mapping;
      lookups = importResource.netsuite.lookups;
    }
  } else if (importType === 'salesforce') {
    options.sObjectType = importResource.salesforce.sObjectType;
    mapping = importResource.mapping;
    lookups = importResource[importType].lookups;
  }
  const subRecordFields = mapping?.fields?.filter(f => f.mappingId);
  // const {type: importType, mapping} = importRes;
  const flattenedMapping = generateFieldAndListMappings({importType, mapping, exportResource, isGroupedSampleData: false});

  yield put(actions.suiteScript.mapping.initComplete(
    {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      mappings: flattenedMapping,
      subRecordFields,
      lookups,
      options,
    }));
  yield put(actions.suiteScript.mapping.refreshGenerates({isInit: true }));
}

export function* saveMappings() {
  const {
    mappings,
    lookups,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    recordType,
    subRecordFields,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMapping);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const {export: exportConfig, import: importRes, _id: resourceId} = flow;
  const { type: importType, _connectionId } = importRes;
  const options = {};

  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;

    const { data: childRelationshipFields = [] } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });

    options.childRelationships = childRelationshipFields;
  } else if (importType === 'netsuite') {
    options.recordType = recordType;
  }
  const _mappings = updateMappingConfigs({importType, mappings, exportConfig, options});

  // add subrecord fields
  if (subRecordFields?.length) {
    _mappings.fields = [..._mappings.fields, ...subRecordFields];
  }
  const patchSet = [];

  if (subRecordMappingId) {
    const {subRecordImports} = importRes?.netsuite;
    const modifiedsubRecordImports = deepClone(subRecordImports);
    const modifyMappingForSubRecord = subRecords => {
      if (subRecords?.length) {
        for (let i = 0; i < subRecords.length; i += 1) {
          const subRecord = subRecords[i];

          if (subRecord.mappingId === subRecordMappingId) {
            subRecord.mapping = _mappings;
            subRecord.lookups = lookups;
            break;
          }
          modifyMappingForSubRecord(subRecord?.subRecordImports);
        }
      }
    };

    modifyMappingForSubRecord(modifiedsubRecordImports);
    patchSet.push({
      op: 'replace',
      path: '/import/netsuite/subRecordImports',
      value: modifiedsubRecordImports,
    });
  } else {
    patchSet.push({
      op: importRes.mapping ? 'replace' : 'add',
      path: '/import/mapping',
      value: _mappings,
    });
    if (lookups) {
      patchSet.push({
        op: importRes[importType] && importRes[importType].lookups ? 'replace' : 'add',
        path: `/import/${importType}/lookups`,
        value: lookups,
      });
    }
  }

  const resourceType = 'imports';

  yield put(
    actions.suiteScript.resource.patchStaged(
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      patchSet,
      SCOPES.VALUE,
    )
  );
  const resp = yield call(commitStagedChanges, {
    resourceType,
    id: resourceId,
    scope: SCOPES.VALUE,
    ssLinkedConnectionId,
    integrationId,
  });

  if (resp && (resp.error || resp.conflict)) {
    return yield put(
      actions.suiteScript.mapping.saveFailed()
    );
  }

  return yield put(
    actions.suiteScript.mapping.saveComplete()
  );
}
export function* checkForIncompleteSFGenerateWhilePatch({ field, value = '' }) {
  if (value.indexOf('_child_') === -1) {
    return;
  }
  const {
    mappings = [],
    subRecordMappingId,
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMapping);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const { import: importRes } = flow;
  const {type: importType} = importRes;

  if (importType !== 'salesforce' || field !== 'generate') {
    return;
  }
  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId });
  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj;
  const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);

  if (childRelationshipField && childRelationshipField.childSObject) {
    const { childSObject, relationshipName } = childRelationshipField;

    yield put(actions.suiteScript.mapping.patchIncompleteGenerates(
      {
        key,
        value: relationshipName,
      }
    )
    );
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          sObjects: [childSObject],
        },
      }
    ));
  }
}

export function* checkForSFSublistExtractPatch({key, value}) {
  const {
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMapping);
  const {data: flowSampleData} = yield select(selectors.suiteScriptFlowSampleData, {ssLinkedConnectionId, integrationId, flowId});

  const childRelationshipField =
  flowSampleData && flowSampleData.find(field => field.value === value);

  if (childRelationshipField && childRelationshipField.childSObject) {
    yield put(actions.suiteScript.mapping.setSFSubListFieldName(value));
    yield put(actions.suiteScript.mapping.updateLastFieldTouched(key));
  }
}

export function* updateImportSampleData() {
  // identify sample data change
  const {
    incompleteGenerates = [],
    mappings = [],
    ssLinkedConnectionId,
    integrationId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMapping);

  if (!incompleteGenerates.length) return;

  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId });
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
      // TODO we need rowIdentifier to refersh row. Add this to reducer
      if (!objCopy.rowIdentifier) {
        objCopy.rowIdentifier = 1;
      } else objCopy.rowIdentifier += 1;
      modifiedMappings[incompleteGenIndex] = objCopy;
    }
  });

  yield put(actions.suiteScript.mapping.updateMappings(modifiedMappings));
}

export function* patchGenerateThroughAssistant({value}) {
  const {
    lastModifiedRowKey,
  } = yield select(selectors.suiteScriptMapping);

  // trigger patch only when user has touched some field.On touch of last field lastModifiedRowKey = 'new'
  if (lastModifiedRowKey) {
    yield put(actions.suiteScript.mapping.patchField('generate',
      lastModifiedRowKey,
      value)
    );
  }
}

export function* requestPatchField({key, field, value}) {
  const {mappings} = yield select(selectors.suiteScriptMapping);
  const mapping = mappings.find(_m => _m.key === key) || {};
  const {generate, extract} = mapping;

  // check if value changes or user entered something in new row
  if ((!key && value) || (key && mapping[field] !== value)) {
    if (key && value === '') {
      if (
        (field === 'extract' && !generate) ||
        (field === 'generate' &&
          !extract &&
          !('hardCodedValue' in mapping))
      ) {
        return yield put(actions.suiteScript.mapping.delete(key));
      }
    }

    return yield put(actions.suiteScript.mapping.patchField(field, key, value));
  }
}

export function* validateSuitescriptMappings() {
  const {
    mappings,
    lookups,
    validationErrMsg,
  } = yield select(selectors.suiteScriptMapping);
  const {
    isSuccess,
    errMessage,
  } = validateMappings(mappings, lookups);
  const newValidationErrMsg = isSuccess ? undefined : errMessage;

  if (newValidationErrMsg !== validationErrMsg) {
    yield put(actions.suiteScript.mapping.setValidationMsg(newValidationErrMsg));
  }
}
export const mappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.SAVE, saveMappings),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.REFRESH_GENEREATES, refreshGenerates),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH, checkForSFSublistExtractPatch),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_GENERATE_THROUGH_ASSISTANT, patchGenerateThroughAssistant),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD_REQUEST, requestPatchField),
  takeLatest([
    actionTypes.SUITESCRIPT.MAPPING.DELETE,
    actionTypes.SUITESCRIPT.MAPPING.UPDATE_LOOKUP,
    actionTypes.SUITESCRIPT.MAPPING.PATCH_SETTINGS,
  ], validateSuitescriptMappings),

];
