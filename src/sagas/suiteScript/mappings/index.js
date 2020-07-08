import { takeEvery, put, select, call, takeLatest } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import suiteScriptMappingUtil from '../../../utils/suiteScriptMapping';
import { commitStagedChanges } from '../resources';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};

export function* refreshGenerates({ isInit = false }) {
  const {
    mappings = [],
    ssLinkedConnectionId,
    integrationId,
    flowId,
  } = yield select(selectors.suiteScriptMappings);

  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importRes } = flow;
  const {type: importType, _connectionId} = importRes;

  const {data: importData} = yield select(selectors.suiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
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
        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    if (isInit) {
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
        }
      }
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    // TODO
    // if (application === adaptorTypeMap.NetSuiteImport && subRecordMappingId) {
    //   opts.recordType = netsuiteRecordType;
    // }
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          refreshCache: !isInit,
        }
      }
    )
    );
  }
}
export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId }) {
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const {export: exportRes, import: importRes} = flow;
  const {type: importType, mapping} = importRes;

  const {lookups = []} = importRes[importType];
  let exportType;
  if (exportRes.netsuite && ['restlet', 'batch', 'realtime'].includes(exportRes.netsuite.type)) {
    exportType = 'netsuite';
  } else {
    exportType = exportRes.type;
  }


  // const {type: importType, mapping} = importRes;
  const generatedMappings = suiteScriptMappingUtil.generateFieldAndListMappings({importType, mapping, exportRes, isGroupedSampleData: false});

  const options = {
    importType,
    exportType,
    connectionId: importRes._connectionId
  };
  if (importType === 'netsuite') {
    options.recordType = importRes.netsuite.recordType;
  } else if (importType === 'salesforce') {
    options.sObjectType = importRes.salesforce.sObjectType;
  }
  yield put(actions.suiteScript.mapping.initComplete(
    {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      generatedMappings,
      lookups,
      options
    }));
  yield call(refreshGenerates, {isInit: true });
}

export function* saveMappings() {
  const {
    mappings,
    lookups,
    ssLinkedConnectionId,
    integrationId,
    flowId
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const {export: exportConfig, import: importRes, _id: resourceId} = flow;
  const { type: importType, _connectionId } = importRes;
  const options = {};
  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;

    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    options.childRelationships = childRelationshipFields;
  } else if (importType === 'netsuite') {
    const { recordType } = importRes.netsuite;
    options.recordType = recordType;
  }
  const _mappings = suiteScriptMappingUtil.updateMappingConfigs({importType, mappings, exportConfig, options});
  const patchSet = [];
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
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importRes } = flow;
  const {type: importType} = importRes;
  if (importType !== 'salesforce' || field !== 'generate') {
    return;
  }
  const {data: importData} = yield select(selectors.suiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
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
        value: relationshipName
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
        }
      }
    ));
  }
}

export function* checkForSFSublistExtractPatch({key, value}) {
  const {
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMappings);
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
    flowId
  } = yield select(selectors.suiteScriptMappings);
  if (!incompleteGenerates.length) return;
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importRes } = flow;
  const {type: importType} = importRes;

  const {data: importData} = yield select(selectors.suiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
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

  yield put(actions.suiteScript.mapping.updateMappings(modifiedMappings));
}

export const mappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.SAVE, saveMappings),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.REFRESH_GENEREATES, refreshGenerates),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH, checkForSFSublistExtractPatch),


];
